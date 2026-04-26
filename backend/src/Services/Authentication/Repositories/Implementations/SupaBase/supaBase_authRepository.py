"""Supabase-backed auth repository implementation (scaffold)."""


class SupaBaseAuthRepository:
    def __init__(self, client=None):
        self.client = client

    def get_user_by_username(self, username: str):
        return None
