## Script to populate the database with ADEME-aligned quiz questions
import os
import requests
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

# Each option: label, value (representative quantity), co2 (kg CO2/year).
# "Autre valeur" options use min_value=-1 as a flag so the frontend renders
# a numeric input. Their co2 field is the CO2 rate per unit entered (kg/unit).
QUESTIONS_DATA = [
    # ── Transport ───────────────────────────────────────────────────────────
    {
        "category": "Transport",
        "question": "Quelle distance parcourez-vous en voiture par semaine (conducteur ou passager) ?",
        "options": [
            {"label": "Je ne prends pas la voiture",          "value": 0,    "co2": 0},
            {"label": "Moins de 50 km",                       "value": 25,   "co2": 50},
            {"label": "50 à 150 km",                          "value": 100,  "co2": 200},
            {"label": "150 à 300 km",                         "value": 225,  "co2": 450},
            {"label": "Plus de 300 km",                       "value": 400,  "co2": 800},
            # Autre — co2 = 2 kg CO2 per km/week (annualised ~0.04 kg/km × 52w)
            {"label": "Autre valeur (précisez en km/semaine)", "value": 0, "min_value": -1, "co2": 2.0},
        ],
    },
    {
        "category": "Transport",
        "question": "Sur l'année écoulée, combien de vols avez-vous effectués ?",
        "options": [
            {"label": "Aucun vol",                                   "value": 0, "co2": 0},
            {"label": "1 à 2 vols courts courriers (< 3 h de vol)",  "value": 1, "co2": 400},
            {"label": "3 à 5 vols courts courriers (< 3 h de vol)",  "value": 4, "co2": 900},
            {"label": "1 à 2 vols longs courriers (> 3 h de vol)",   "value": 2, "co2": 2000},
            {"label": "Plus de 5 vols par an",                       "value": 6, "co2": 3000},
            # Autre — co2 = 400 kg CO2 per flight (average short-haul)
            {"label": "Autre valeur (précisez le nombre de vols)", "value": 0, "min_value": -1, "co2": 400.0},
        ],
    },
    # ── Alimentation ────────────────────────────────────────────────────────
    {
        "category": "Alimentation",
        # ADEME baseline: ~14 main meals per week
        "question": "Sur une semaine type (14 repas principaux), comment qualifieriez-vous votre alimentation ?",
        "options": [
            {"label": "Végétarien ou végétalien",                                     "value": 0,   "co2": 40},
            {"label": "Flexitarien (principalement végétarien, viande 1-2×/sem)",     "value": 1.5, "co2": 100},
            {"label": "Omnivore – peu de viande rouge (≤ 2 repas avec bœuf/agneau/sem)", "value": 2,"co2": 200},
            {"label": "Omnivore – viande rouge modérée (3-5 repas avec bœuf/agneau/sem)","value": 4,"co2": 350},
            {"label": "Omnivore – viande rouge fréquente (> 5 repas avec bœuf/agneau/sem)","value": 7,"co2": 550},
            # Autre — co2 = 100 kg CO2 per meat meal per week (annualised)
            {"label": "Autre valeur (précisez vos repas carnés par semaine)", "value": 0, "min_value": -1, "co2": 100.0},
        ],
    },
    {
        "category": "Alimentation",
        "question": "Quelle part de vos achats alimentaires provient de produits locaux et de saison ?",
        "options": [
            {"label": "Presque tout (marchés, AMAP, circuit court)",      "value": 5, "co2": 30},
            {"label": "Plus de la moitié",                                 "value": 3, "co2": 100},
            {"label": "Environ la moitié",                                 "value": 2, "co2": 200},
            {"label": "Moins de la moitié",                                "value": 1, "co2": 300},
            {"label": "Très peu ou pas du tout (grande surface standard)", "value": 0, "co2": 400},
        ],
    },
    # ── Énergie ─────────────────────────────────────────────────────────────
    {
        "category": "Énergie",
        # ADEME: annual electricity consumption from bill
        "question": "Quelle est la consommation électrique annuelle de votre foyer ? (Consultez votre facture d'électricité)",
        "options": [
            {"label": "Moins de 2 000 kWh/an",           "value": 1500,  "co2": 175},
            {"label": "2 000 à 4 500 kWh/an",            "value": 3250,  "co2": 380},
            {"label": "4 500 à 7 500 kWh/an",            "value": 6000,  "co2": 700},
            {"label": "Plus de 7 500 kWh/an",            "value": 10000, "co2": 1150},
            {"label": "Je ne sais pas (foyer moyen)",     "value": 4500,  "co2": 525},
            # Autre — co2 = 0.12 kg CO2/kWh (French mix, annualised)
            {"label": "Autre valeur (précisez en kWh/an)", "value": 0, "min_value": -1, "co2": 0.12},
        ],
    },
    {
        "category": "Énergie",
        # ADEME: gas/heating consumption
        "question": "Quel est votre principal mode de chauffage ?",
        "options": [
            {"label": "Électricité (pompe à chaleur, radiateurs électriques)", "value": 3000,  "co2": 350},
            {"label": "Gaz naturel",                                            "value": 12000, "co2": 2460},
            {"label": "Fioul domestique",                                        "value": 10000, "co2": 3200},
            {"label": "Bois / granulés / biomasse",                             "value": 8000,  "co2": 160},
            {"label": "Chauffage urbain (réseau de chaleur)",                   "value": 5000,  "co2": 400},
            # Autre — co2 = 0.21 kg CO2/kWh (average gas)
            {"label": "Autre valeur (précisez votre consommation en kWh/an)", "value": 0, "min_value": -1, "co2": 0.21},
        ],
    },
    # ── Numérique ────────────────────────────────────────────────────────────
    {
        "category": "Numérique",
        # ADEME: weekly streaming hours
        "question": "Combien d'heures par semaine passez-vous à regarder des vidéos en streaming (Netflix, YouTube, Prime…) ?",
        "options": [
            {"label": "Moins de 2 heures",    "value": 1,   "co2": 2},
            {"label": "2 à 5 heures",         "value": 3.5, "co2": 7},
            {"label": "5 à 10 heures",        "value": 7.5, "co2": 14},
            {"label": "10 à 20 heures",       "value": 15,  "co2": 28},
            {"label": "Plus de 20 heures",    "value": 25,  "co2": 47},
            # Autre — co2 = 1.9 kg CO2 per h/week/year (ADEME ~0.036 kg/h × 52w)
            {"label": "Autre valeur (précisez en heures/semaine)", "value": 0, "min_value": -1, "co2": 1.9},
        ],
    },
    # ── Consommation ─────────────────────────────────────────────────────────
    {
        "category": "Consommation",
        "question": "Combien de vêtements neufs achetez-vous par an ?",
        "options": [
            {"label": "Moins de 5 pièces",       "value": 3,  "co2": 60},
            {"label": "5 à 10 pièces",           "value": 7,  "co2": 140},
            {"label": "10 à 20 pièces",          "value": 15, "co2": 300},
            {"label": "Plus de 20 pièces",       "value": 25, "co2": 500},
            # Autre — co2 = 20 kg CO2 per item (ADEME average)
            {"label": "Autre valeur (précisez le nombre de pièces/an)", "value": 0, "min_value": -1, "co2": 20.0},
        ],
    },
    {
        "category": "Consommation",
        "question": "Combien d'appareils électroniques neufs (téléphone, ordinateur, TV…) achetez-vous par an ?",
        "options": [
            {"label": "Aucun",              "value": 0, "co2": 0},
            {"label": "1 appareil",         "value": 1, "co2": 100},
            {"label": "2 à 3 appareils",    "value": 2, "co2": 250},
            {"label": "Plus de 3 appareils","value": 4, "co2": 500},
            # Autre — co2 = 100 kg CO2 per device
            {"label": "Autre valeur (précisez le nombre d'appareils)", "value": 0, "min_value": -1, "co2": 100.0},
        ],
    },
]


def main():
    print("Clearing existing quiz questions…")
    requests.delete(
        f"{SUPABASE_URL}/rest/v1/onboarding_questions?id=not.is.null",
        headers=HEADERS,
    )

    for i, q_data in enumerate(QUESTIONS_DATA):
        print(f"  Inserting: {q_data['question'][:60]}…")

        q_resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/onboarding_questions",
            headers=HEADERS,
            json={"question": q_data["question"], "domain": q_data["category"], "order_index": i + 1},
        )
        if q_resp.status_code not in (200, 201):
            print(f"  ✗ Failed to insert question: {q_resp.text}")
            continue

        q_id = q_resp.json()[0]["id"]

        answers_payload = []
        for opt in q_data["options"]:
            answers_payload.append({
                "question_id": q_id,
                "label":       opt["label"],
                # min_value = -1 flags the "Autre" / free-input option
                "min_value":   float(opt.get("min_value", 0)),
                "max_value":   float(opt["value"]),
                "co2_value":   float(opt["co2"]),
            })

        ans_resp = requests.post(
            f"{SUPABASE_URL}/rest/v1/onboarding_answers",
            headers=HEADERS,
            json=answers_payload,
        )
        if ans_resp.status_code not in (200, 201):
            print(f"  ✗ Failed to insert answers for question {q_id}: {ans_resp.text}")
        else:
            print(f"  ✓ {len(answers_payload)} options inserted.")

    print("\nDone — database populated with ADEME-aligned questions.")


if __name__ == "__main__":
    main()
