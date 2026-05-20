from typing import List, Dict
from concurrent.futures import ThreadPoolExecutor
from fastapi import HTTPException, status
from datetime import datetime

from Gamification.Schemas.gamificationSchemas import (
    ChallengeResponse,
    ToggleChallengeRequest,
    ToggleChallengeResponse,
    CreateChallengeRequest,
    CreateChallengeResponse
)
from Gamification.Repositories.Interfaces.gamificationInterface import GamificationRepositoryInterface

# Map challenge domains (as stored in DB) to emission keys
_DOMAIN_TO_EMISSION = {
    "transport": "Transport",
    "mobilité": "Transport",
    "alimentation": "Alimentation",
    "food": "Alimentation",
    "énergie": "Énergie",
    "energie": "Énergie",
    "energy": "Énergie",
    "consommation": "Consommation",
    "consumption": "Consommation",
    "mode de vie": "Consommation",
}

def get_recommendations_controller(user_id: str, repo: GamificationRepositoryInterface) -> List[ChallengeResponse]:
    # Run the 3 independent DB queries in parallel to reduce latency (~7 s vs ~21 s)
    with ThreadPoolExecutor(max_workers=3) as executor:
        f_all = executor.submit(repo.get_all_challenges)
        f_completed = executor.submit(repo.get_user_completed_challenges, user_id)
        f_emissions = executor.submit(repo.get_user_emissions, user_id)
        all_challenges = f_all.result()
        completed_ids = set(f_completed.result())
        emissions = f_emissions.result()

    # Separate uncompleted and completed
    uncompleted = [c for c in all_challenges if str(c["id"]) not in completed_ids]
    completed_challenges = [c for c in all_challenges if str(c["id"]) in completed_ids]

    # Rank emission categories by value (highest first = most flexibility)
    ranked_domains = sorted(emissions.keys(), key=lambda k: emissions[k], reverse=True)

    # Group uncompleted challenges by emission domain
    by_domain: Dict[str, list] = {d: [] for d in ranked_domains}
    ungrouped: list = []
    for c in uncompleted:
        raw_domain = c.get("domain", "").lower()
        emission_key = _DOMAIN_TO_EMISSION.get(raw_domain)
        if emission_key and emission_key in by_domain:
            by_domain[emission_key].append(c)
        else:
            ungrouped.append(c)

    # Build a list of 6: prioritise highest-emission domain
    # Distribution: top domain gets 3 slots, second gets 2, others 1 each (capped at 6 total)
    slots = [3, 2, 1]
    chosen: list = []
    for i, domain in enumerate(ranked_domains):
        quota = slots[i] if i < len(slots) else 1
        pool = by_domain.get(domain, [])
        chosen.extend(pool[:quota])
        if len(chosen) >= 6:
            break

    # Fill remaining slots with ungrouped or any uncompleted not yet chosen
    chosen_ids = {str(c["id"]) for c in chosen}
    extras = [c for c in ungrouped if str(c["id"]) not in chosen_ids]
    extras += [c for c in uncompleted if str(c["id"]) not in chosen_ids and c not in extras]
    chosen.extend(extras[:max(0, 6 - len(chosen))])

    # If everything is completed, auto-reset those 6 challenges so user can redo them
    if len(chosen) == 0 and completed_challenges:
        wave = completed_challenges[:6]
        wave_ids = [str(c["id"]) for c in wave]
        repo.reset_user_challenges(user_id, wave_ids)
        # After reset they are no longer completed — return them as unchecked
        completed_ids -= set(wave_ids)
        chosen = wave

    result = []
    for c in chosen[:6]:
        c_id = str(c["id"])
        result.append(ChallengeResponse(
            id=c_id,
            title=c.get("title", "Sans titre"),
            points=c.get("points", 0),
            category=c.get("domain", "Général"),
            completed=(c_id in completed_ids)
        ))
    return result

def toggle_challenge_controller(
    user_id: str, 
    challenge_id: str, 
    payload: ToggleChallengeRequest, 
    repo: GamificationRepositoryInterface
) -> ToggleChallengeResponse:
    
    all_challenges = repo.get_all_challenges()
    target_challenge = next((c for c in all_challenges if str(c["id"]) == challenge_id), None)
    
    if not target_challenge:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Challenge not found")
        
    challenge_points = target_challenge.get("points", 0)
    completed_ids = set(repo.get_user_completed_challenges(user_id))
    is_currently_completed = challenge_id in completed_ids
    
    points_delta = 0
    if payload.completed and not is_currently_completed:
        points_delta = challenge_points
    elif not payload.completed and is_currently_completed:
        points_delta = -challenge_points
        
    # Get current stats
    stats = repo.get_user_stats(user_id) or {"total_points": 0, "trees_planted": 0}
    current_points = stats.get("total_points") or 0
    
    new_total_points = current_points + points_delta
    # Prevent negative points
    if new_total_points < 0:
        new_total_points = 0
        
    new_trees_planted = new_total_points // 1000
    tree_progress = (new_total_points % 1000) // 10
    
    # Save only if there's a change
    if points_delta != 0:
        repo.toggle_user_challenge(user_id, challenge_id, payload.completed)
        repo.update_user_stats(user_id, new_total_points, new_trees_planted)
        
    return ToggleChallengeResponse(
        success=True,
        challengeId=challenge_id,
        completed=payload.completed,
        pointsDelta=points_delta,
        totalPoints=new_total_points,
        treesPlanted=new_trees_planted,
        treeProgress=tree_progress
    )

def create_challenge_controller(payload: CreateChallengeRequest, repo: GamificationRepositoryInterface) -> CreateChallengeResponse:
    db_payload = {
        "title": payload.title,
        "domain": payload.category,
        "points": payload.points
    }
    
    try:
        created = repo.create_challenge(db_payload)
        return CreateChallengeResponse(
            success=True,
            challenge={
                "id": str(created.get("id")),
                "title": created.get("title"),
                "category": created.get("domain"),
                "points": created.get("points"),
                "completed": False
            }
        )
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
