from typing import Protocol, Optional, Dict, Any


class UserRepositoryInterface(Protocol):
    def get_user_dashboard_data(self, user_id: str) -> Optional[Dict[str, Any]]:
        """
        Fetch user profile, latest onboarding results, and user stats.
        Returns a dictionary with raw data to be formatted by the controller.
        """
        ...
