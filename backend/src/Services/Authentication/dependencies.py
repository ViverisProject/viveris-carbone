"""Authentication dependency providers.

Provides DI helpers for routes (e.g., repository instances).
"""

from typing import Optional

from config import SUPABASE_URL, SUPABASE_KEY
from Authentication.Repositories.Implementations.SupaBase.supaBase_authRepository import (
    SupaBaseAuthRepository,
)


_repo_instance: Optional[SupaBaseAuthRepository] = None


def get_auth_repo() -> SupaBaseAuthRepository:
    global _repo_instance
    if _repo_instance is None:
        if not SUPABASE_URL or not SUPABASE_KEY:
            raise RuntimeError("Supabase credentials not configured in config.py")
        _repo_instance = SupaBaseAuthRepository(SUPABASE_URL, SUPABASE_KEY)
    return _repo_instance
