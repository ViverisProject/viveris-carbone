"""Supabase-backed user repository implementation."""

from typing import Optional, Dict, Any
import requests

from UserManagement.Repositories.Interfaces.userInterface import UserRepositoryInterface


class SupaBaseUserRepository(UserRepositoryInterface):
    def __init__(self, supabase_url: str, supabase_key: str):
        self.supabase_url = supabase_url.rstrip("/")
        self.supabase_key = supabase_key
        self.headers = {
            "apikey": self.supabase_key,
            "Authorization": f"Bearer {self.supabase_key}",
            "Content-Type": "application/json",
            "Accept": "application/json",
        }

    def _endpoint(self, table: str) -> str:
        return f"{self.supabase_url}/rest/v1/{table}"

    def get_user_dashboard_data(self, user_id: str) -> Optional[Dict[str, Any]]:
        # Use PostgREST syntax to join users with user_stats and onboarding_results
        params = {
            "id": f"eq.{user_id}",
            "select": "*,user_stats(*),onboarding_results(*)"
        }
        
        resp = requests.get(self._endpoint("users"), headers=self.headers, params=params)
        
        if resp.status_code == 200:
            data = resp.json()
            if data and len(data) > 0:
                user_data = data[0]
                
                # Sort onboarding_results by created_at desc manually
                if "onboarding_results" in user_data and isinstance(user_data["onboarding_results"], list):
                    user_data["onboarding_results"].sort(key=lambda x: x.get("created_at", ""), reverse=True)
                
                return user_data
                
        return None