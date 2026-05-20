from typing import Protocol, List, Dict, Any, Optional

class GamificationRepositoryInterface(Protocol):
    def get_all_challenges(self) -> List[Dict[str, Any]]:
        """Fetch all globally available challenges."""
        ...
        
    def get_user_completed_challenges(self, user_id: str) -> List[str]:
        """Fetch list of challenge IDs completed by the user."""
        ...
        
    def toggle_user_challenge(self, user_id: str, challenge_id: str, completed: bool) -> None:
        """Upsert a record in user_challenges to mark it completed or not."""
        ...
        
    def get_user_stats(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Fetch the current stats (total_points, trees_planted) for the user."""
        ...
        
    def update_user_stats(self, user_id: str, new_points: int, new_trees: int) -> None:
        """Update total_points and trees_planted for the user."""
        ...
        
    def create_challenge(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new global challenge."""
        ...

    def get_user_emissions(self, user_id: str) -> Dict[str, float]:
        """Fetch user's latest category emissions. Keys: Transport, Alimentation, Énergie, Consommation."""
        ...

    def reset_user_challenges(self, user_id: str, challenge_ids: List[str]) -> None:
        """Delete user_challenges rows so the given challenges appear uncompleted again."""
        ...
