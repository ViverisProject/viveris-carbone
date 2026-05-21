import os
import requests
import json
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing Supabase credentials")
    exit(1)

SUPABASE_URL = SUPABASE_URL.rstrip("/")
HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation"
}

json_path = os.path.join(os.path.dirname(__file__), "..", "frontend", "src", "data", "challenges.json")
try:
    with open(json_path, "r", encoding="utf-8") as f:
        challenges_data = json.load(f)
except Exception as e:
    print(f"Could not load challenges.json: {e}")
    exit(1)

def main():
    print("Clearing existing challenges...")
    resp = requests.delete(f"{SUPABASE_URL}/rest/v1/challenges?id=not.is.null", headers=HEADERS)
    if resp.status_code not in (200, 204):
        print(f"Failed to clear challenges: {resp.text}")

    print(f"Inserting {len(challenges_data)} challenges...")
    payload = []
    for c in challenges_data:
        payload.append({
            "title": c["title"],
            "domain": c["category"],
            "points": c["points"]
        })
    
    resp = requests.post(f"{SUPABASE_URL}/rest/v1/challenges", headers=HEADERS, json=payload)
    if resp.status_code in (200, 201):
        print("Successfully seeded challenges!")
    else:
        print(f"Failed to insert challenges: {resp.status_code} {resp.text}")

if __name__ == '__main__':
    main()
