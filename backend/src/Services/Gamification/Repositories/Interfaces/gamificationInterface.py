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
        """Fetch the current stats (total_points, trees_planted, challenge_batch_offset) for the user."""
        ...

    def get_user_flexibility_domains(self, user_id: str) -> List[str]:
        """Return the flexibility domains selected by the user during onboarding (e.g. ['food', 'transport'])."""
        ...
        
    def update_user_stats(self, user_id: str, new_points: int, new_trees: Optional[int] = None) -> None:
        """Update total_points and optionally trees_planted for the user."""
        ...

    def reset_challenges_completion(self, user_id: str, challenge_ids: List[str]) -> None:
        """Reset completed=False for specific challenges (used when starting a new batch)."""
        ...

    def advance_challenge_batch(self, user_id: str, new_offset: int) -> None:
        """Persist the new challenge batch offset for the user."""
        ...
        
    def create_challenge(self, data: Dict[str, Any]) -> Dict[str, Any]:
        """Create a new global challenge."""
        ...
