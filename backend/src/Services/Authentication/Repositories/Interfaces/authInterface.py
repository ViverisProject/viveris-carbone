"""Authentication repository interface definitions (scaffold)."""

from typing import Protocol, Optional


class AuthRepositoryInterface(Protocol):
    def get_user_by_username(self, username: str) -> Optional[dict]:
        ...
