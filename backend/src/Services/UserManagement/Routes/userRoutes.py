"""User management routes."""

from fastapi import APIRouter, Depends, status

from UserManagement.Schemas.userSchemas import UserProfileDashboardResponse
from UserManagement.Controllers.userControllers import get_user_dashboard
from UserManagement.dependencies import get_user_repo
from UserManagement.Repositories.Interfaces.userInterface import UserRepositoryInterface
from Authentication.dependencies import get_current_user

# Note: The router is included in main.py. We can use prefix="" or just define the route.
# API.md expects /api/users/me. main.py doesn't prefix, so we prefix here.
router = APIRouter(prefix="/api/users", tags=["users"])


@router.get(
    "/me",
    response_model=UserProfileDashboardResponse,
    status_code=status.HTTP_200_OK,
    summary="Get user dashboard data",
    description="Returns user profile, total emissions, category breakdown, points, and achievements.",
)
async def get_me(
    user_id: str = Depends(get_current_user),
    repo: UserRepositoryInterface = Depends(get_user_repo)
):
    """Get the current user's full dashboard profile."""
    return get_user_dashboard(user_id, repo)

