"""User management controllers."""

from fastapi import HTTPException, status
from typing import Dict, Any, List

from UserManagement.Schemas.userSchemas import (
    UserProfileDashboardResponse,
    UserObject,
    QuizResult,
    Achievement
)
from UserManagement.Repositories.Interfaces.userInterface import UserRepositoryInterface


def _generate_achievements(stats: Dict[str, Any]) -> List[Achievement]:
    achievements = []
    trees = stats.get("trees_planted", 0)
    streak = stats.get("streak", 0)
    
    if trees >= 1:
        achievements.append(Achievement(id="first-tree", name="Premier arbre", unlocked=True))
    if streak >= 7:
        achievements.append(Achievement(id="7-days", name="7 Jours consécutifs", unlocked=True))
        
    return achievements


def get_user_dashboard(user_id: str, repo: UserRepositoryInterface) -> UserProfileDashboardResponse:
    raw_data = repo.get_user_dashboard_data(user_id)
    if not raw_data:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
        
    # Extract User Object
    user_obj = UserObject(
        id=raw_data.get("id"),
        firstName=raw_data.get("first_name"),
        lastName=raw_data.get("last_name"),
        email=raw_data.get("email", "")
    )
    
    # Extract Stats
    stats_data = raw_data.get("user_stats")
    if isinstance(stats_data, list) and len(stats_data) > 0:
        stats = stats_data[0]
    elif isinstance(stats_data, dict):
        stats = stats_data
    else:
        stats = {}
        
    points = stats.get("total_points", 0)
    trees_planted = stats.get("trees_planted", 0)
    streak = stats.get("streak", 0)
    best_streak = stats.get("best_streak", 0)
    
    achievements = _generate_achievements(stats)
    
    # Extract Onboarding Results (Footprint)
    quiz_result = None
    category_emissions = None
    
    ob_results = raw_data.get("onboarding_results")
    if isinstance(ob_results, list) and len(ob_results) > 0:
        latest = ob_results[0]
        category_emissions = {
            "Transport": latest.get("transport_co2", 0),
            "Alimentation": latest.get("food_co2", 0),
            "Énergie": latest.get("energy_co2", 0),
            "Consommation": latest.get("consumption_co2", 0)
        }
        quiz_result = QuizResult(
            totalInTons=latest.get("total_co2", 0),
            categoryBreakdown=category_emissions
        )
        
    return UserProfileDashboardResponse(
        user=user_obj,
        quizResult=quiz_result,
        categoryEmissions=category_emissions,
        points=points,
        treesPlanted=trees_planted,
        achievements=achievements,
        streak=streak,
        bestStreak=best_streak
    )
