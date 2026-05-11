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

def get_recommendations_controller(user_id: str, repo: GamificationRepositoryInterface) -> List[ChallengeResponse]:
    all_challenges = repo.get_all_challenges()
    completed_ids = set(repo.get_user_completed_challenges(user_id))
    
    result = []
    # For now, return all challenges (or top 10). The frontend can filter.
    for c in all_challenges[:10]:
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
