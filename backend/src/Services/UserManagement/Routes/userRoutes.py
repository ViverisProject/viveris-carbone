"""User management routes (renamed from renameRoutes.py)."""

from fastapi import APIRouter

router = APIRouter()


@router.get("/users/health")
async def users_health():
    return {"status": "users OK"}
