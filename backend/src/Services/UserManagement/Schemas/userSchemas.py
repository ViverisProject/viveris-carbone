from typing import Optional, Dict, List
from pydantic import BaseModel


class UserObject(BaseModel):
    id: str
    firstName: Optional[str]
    lastName: Optional[str]
    email: str


class QuizResult(BaseModel):
    totalInTons: float
    categoryBreakdown: Dict[str, float]


class Achievement(BaseModel):
    id: str
    name: str
    unlocked: bool


class UserProfileDashboardResponse(BaseModel):
    user: UserObject
    quizResult: Optional[QuizResult] = None
    categoryEmissions: Optional[Dict[str, float]] = None
    points: int
    treesPlanted: int
    achievements: List[Achievement]
    streak: int
    bestStreak: int

    model_config = {
        "json_schema_extra": {
            "example": {
                "user": {
                    "id": "uuid",
                    "firstName": "Jean",
                    "lastName": "Dupont",
                    "email": "jean.dupont@example.com"
                },
                "quizResult": {
                    "totalInTons": 2.8,
                    "categoryBreakdown": {
                        "Transport": 1.8,
                        "Alimentation": 1.2,
                        "Énergie": 1.5,
                        "Consommation": 0.7
                    }
                },
                "categoryEmissions": {
                    "Transport": 1.8,
                    "Alimentation": 1.2,
                    "Énergie": 1.5,
                    "Consommation": 0.7
                },
                "points": 1240,
                "treesPlanted": 2,
                "achievements": [
                    { "id": "first-tree", "name": "Premier arbre", "unlocked": True }
                ],
                "streak": 12,
                "bestStreak": 18
            }
        }
    }
