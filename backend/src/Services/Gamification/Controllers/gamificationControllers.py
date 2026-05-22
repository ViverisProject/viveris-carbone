from typing import List
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

# Maps frontend flexibility domain ids → challenge domain names in DB
_FLEXIBILITY_TO_DOMAIN = {
    "transport":   "Transport",
    "food":        "Alimentation",
    "energy":      "Énergie",
    "consumption": "Consommation",
}


def _build_ordered_challenges(all_challenges: list, flexibility_raw: list) -> list:
    """
    Return challenges sorted so that ~90 % of each batch of 10 comes from the
    user's preferred domains (from flexibility_raw).  The ordering is:
      - 9 preferred, 1 other, 9 preferred, 1 other, …
    When there are no preferences every challenge is treated as preferred.
    """
    preferred_domains = {
        _FLEXIBILITY_TO_DOMAIN.get(d.lower(), d)
        for d in flexibility_raw
    }

    if not preferred_domains:
        return list(all_challenges)

    preferred = [c for c in all_challenges if c.get("domain") in preferred_domains]
    other     = [c for c in all_challenges if c.get("domain") not in preferred_domains]

    if not preferred:
        return list(all_challenges)

    # Interleave: 9 from preferred then 1 from other, repeat
    result: list = []
    p_idx, o_idx = 0, 0
    while p_idx < len(preferred) or o_idx < len(other):
        added = 0
        while added < 9 and p_idx < len(preferred):
            result.append(preferred[p_idx])
            p_idx += 1
            added += 1
        if o_idx < len(other):
            result.append(other[o_idx])
            o_idx += 1
        elif added == 0:
            break
    # Append any trailing "other" items that didn't fit in a full block
    while o_idx < len(other):
        result.append(other[o_idx])
        o_idx += 1
    return result


def get_recommendations_controller(user_id: str, repo: GamificationRepositoryInterface) -> List[ChallengeResponse]:
    all_challenges = repo.get_all_challenges()
    completed_ids = set(repo.get_user_completed_challenges(user_id))

    stats = repo.get_user_stats(user_id) or {}
    offset = int(stats.get("challenge_batch_offset") or 0)

    # Order challenges so preferred domains occupy ~90 % of each batch
    flexibility_raw = repo.get_user_flexibility_domains(user_id)
    ordered = _build_ordered_challenges(all_challenges, flexibility_raw)

    batch = ordered[offset: offset + 10]

    result = []
    for c in batch:
        c_id = str(c["id"])
        result.append(ChallengeResponse(
            id=c_id,
            title=c.get("title", "Sans titre"),
            points=c.get("points", 0),
            category=c.get("domain", "Général"),
            completed=(c_id in completed_ids)
        ))
    return result

def unlock_next_batch_controller(user_id: str, repo: GamificationRepositoryInterface) -> dict:
    all_challenges = repo.get_all_challenges()
    stats = repo.get_user_stats(user_id) or {}
    current_offset = int(stats.get("challenge_batch_offset") or 0)

    # Use the same domain-weighted ordering as get_recommendations_controller
    flexibility_raw = repo.get_user_flexibility_domains(user_id)
    ordered = _build_ordered_challenges(all_challenges, flexibility_raw)

    # Verify the current batch is fully completed before advancing
    completed_ids = set(repo.get_user_completed_challenges(user_id))
    current_batch = ordered[current_offset: current_offset + 10]
    all_done = all(str(c["id"]) in completed_ids for c in current_batch)

    if not all_done:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Terminez tous les défis actuels avant de débloquer la prochaine série."
        )

    new_offset = current_offset + 10
    # If no more challenges in the ordered list, wrap around to 0
    if new_offset >= len(ordered):
        new_offset = 0

    repo.advance_challenge_batch(user_id, new_offset)

    # Increment trees_planted by 1 (one tree per completed batch)
    current_points = int(stats.get("total_points") or 0)
    current_trees = int(stats.get("trees_planted") or 0)
    repo.update_user_stats(user_id, current_points, current_trees + 1)

    # Build and return the new batch directly to avoid a second request
    new_batch = all_challenges[new_offset: new_offset + 10]

    # Reset completion status for the new batch so recycled challenges start fresh
    new_batch_ids = [str(c["id"]) for c in new_batch]
    repo.reset_challenges_completion(user_id, new_batch_ids)

    challenges = []
    for c in new_batch:
        c_id = str(c["id"])
        challenges.append({
            "id": c_id,
            "title": c.get("title", "Sans titre"),
            "points": c.get("points", 0),
            "category": c.get("domain", "Général"),
            "completed": False
        })

    return {"success": True, "newOffset": new_offset, "challenges": challenges}


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

    current_trees = int(stats.get("trees_planted") or 0)

    # Save only if there's a change
    if points_delta != 0:
        repo.toggle_user_challenge(user_id, challenge_id, payload.completed)
        repo.update_user_stats(user_id, new_total_points)

    return ToggleChallengeResponse(
        success=True,
        challengeId=challenge_id,
        completed=payload.completed,
        pointsDelta=points_delta,
        totalPoints=new_total_points,
        treesPlanted=current_trees,
        treeProgress=0
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
