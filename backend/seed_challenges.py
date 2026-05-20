"""
Seed script: populate the 'challenges' table with 24 challenges (6 per domain).
Run from the project root with:
    python backend/seed_challenges.py
"""
import os
import requests
from dotenv import load_dotenv

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL", "").rstrip("/")
SUPABASE_KEY = os.getenv("SUPABASE_KEY", "")

if not SUPABASE_URL or not SUPABASE_KEY:
    print("Error: Missing SUPABASE_URL or SUPABASE_KEY in .env")
    exit(1)

HEADERS = {
    "apikey": SUPABASE_KEY,
    "Authorization": f"Bearer {SUPABASE_KEY}",
    "Content-Type": "application/json",
    "Prefer": "return=representation",
}

CHALLENGES = [
    # ── Transport ──────────────────────────────────────────────────────────────
    {
        "title": "Aller au travail à vélo toute la semaine",
        "description": "Remplacez votre trajet habituel par le vélo pendant 5 jours consécutifs.",
        "domain": "Transport",
        "frequency": "weekly",
        "points": 150,
    },
    {
        "title": "Pratiquer le covoiturage 3 fois",
        "description": "Partagez votre voiture avec un collègue ou voisin pour 3 trajets.",
        "domain": "Transport",
        "frequency": "weekly",
        "points": 120,
    },
    {
        "title": "Prendre les transports en commun pendant une semaine",
        "description": "Bus, métro, tram : zéro voiture solo pendant 7 jours.",
        "domain": "Transport",
        "frequency": "weekly",
        "points": 200,
    },
    {
        "title": "Éviter un vol court-courrier",
        "description": "Remplacez un trajet en avion de moins de 2h par le train ou bus.",
        "domain": "Transport",
        "frequency": "one-time",
        "points": 500,
    },
    {
        "title": "Faire un trajet à pied au lieu de la voiture",
        "description": "Pour tout trajet de moins de 2 km, marchez plutôt que de conduire.",
        "domain": "Transport",
        "frequency": "daily",
        "points": 50,
    },
    {
        "title": "Tester un véhicule électrique ou hybride",
        "description": "Louez ou empruntez un véhicule électrique pour un trajet.",
        "domain": "Transport",
        "frequency": "one-time",
        "points": 300,
    },

    # ── Alimentation ───────────────────────────────────────────────────────────
    {
        "title": "Une journée 100 % végétarienne",
        "description": "Aucune viande ni poisson pendant toute une journée.",
        "domain": "Alimentation",
        "frequency": "daily",
        "points": 80,
    },
    {
        "title": "Réduire la viande rouge à 1 fois cette semaine",
        "description": "Limitez votre consommation de bœuf, porc et agneau à une seule fois sur 7 jours.",
        "domain": "Alimentation",
        "frequency": "weekly",
        "points": 100,
    },
    {
        "title": "Acheter uniquement des produits locaux et de saison",
        "description": "Lors de vos courses, privilégiez les produits cultivés à moins de 100 km.",
        "domain": "Alimentation",
        "frequency": "weekly",
        "points": 120,
    },
    {
        "title": "Zéro gaspillage alimentaire cette semaine",
        "description": "Planifiez vos repas pour ne rien jeter pendant 7 jours.",
        "domain": "Alimentation",
        "frequency": "weekly",
        "points": 150,
    },
    {
        "title": "Cuisiner un repas à base de légumineuses",
        "description": "Lentilles, pois chiches ou haricots en remplacement de la viande.",
        "domain": "Alimentation",
        "frequency": "daily",
        "points": 60,
    },
    {
        "title": "Éviter les emballages plastiques pour les courses",
        "description": "Apportez vos sacs réutilisables et achetez en vrac autant que possible.",
        "domain": "Alimentation",
        "frequency": "weekly",
        "points": 90,
    },

    # ── Énergie ────────────────────────────────────────────────────────────────
    {
        "title": "Baisser le chauffage de 1°C pendant une semaine",
        "description": "Réduisez la température de votre logement d'un degré sur 7 jours.",
        "domain": "Énergie",
        "frequency": "weekly",
        "points": 100,
    },
    {
        "title": "Remplacer toutes les ampoules par des LED",
        "description": "Vérifiez et remplacez chaque ampoule classique par une ampoule LED basse consommation.",
        "domain": "Énergie",
        "frequency": "one-time",
        "points": 200,
    },
    {
        "title": "Prendre des douches de moins de 5 minutes cette semaine",
        "description": "Chronométrez-vous : restez sous les 5 minutes pour chaque douche sur 7 jours.",
        "domain": "Énergie",
        "frequency": "weekly",
        "points": 80,
    },
    {
        "title": "Débrancher les appareils en veille",
        "description": "TV, chargeurs, box internet : débranchez tout ce qui n'est pas utilisé.",
        "domain": "Énergie",
        "frequency": "daily",
        "points": 50,
    },
    {
        "title": "Installer des panneaux solaires",
        "description": "Équipez votre logement d'une installation photovoltaïque.",
        "domain": "Énergie",
        "frequency": "one-time",
        "points": 500,
    },
    {
        "title": "Activer le mode éco sur tous vos appareils électroniques",
        "description": "Activez l'économie d'énergie sur smartphone, PC et TV.",
        "domain": "Énergie",
        "frequency": "one-time",
        "points": 70,
    },

    # ── Consommation ───────────────────────────────────────────────────────────
    {
        "title": "Acheter un vêtement de seconde main",
        "description": "Trouvez votre prochain achat vestimentaire en friperie ou en ligne d'occasion.",
        "domain": "Consommation",
        "frequency": "one-time",
        "points": 130,
    },
    {
        "title": "Réparer un objet cassé au lieu de le jeter",
        "description": "Chaussures, vêtements, appareil électronique : réparez avant de remplacer.",
        "domain": "Consommation",
        "frequency": "one-time",
        "points": 150,
    },
    {
        "title": "Refuser un sac plastique à usage unique",
        "description": "Lors de chaque achat cette semaine, refusez les sacs plastiques jetables.",
        "domain": "Consommation",
        "frequency": "weekly",
        "points": 60,
    },
    {
        "title": "Emprunter plutôt qu'acheter neuf",
        "description": "Pour votre prochain besoin matériel, empruntez à un ami ou voisin.",
        "domain": "Consommation",
        "frequency": "one-time",
        "points": 100,
    },
    {
        "title": "Trier et recycler tous vos déchets cette semaine",
        "description": "Verre, papier, plastique, compost : respectez chaque bac pendant 7 jours.",
        "domain": "Consommation",
        "frequency": "weekly",
        "points": 90,
    },
    {
        "title": "Faire un détox numérique d'une journée",
        "description": "Réduisez votre consommation digitale (streaming, réseaux) d'une journée complète.",
        "domain": "Consommation",
        "frequency": "daily",
        "points": 70,
    },
]


def main():
    endpoint = f"{SUPABASE_URL}/rest/v1/challenges"

    # Fetch existing challenges to avoid duplicates
    existing_resp = requests.get(endpoint, headers=HEADERS, params={"select": "title"})
    existing_titles = set()
    if existing_resp.status_code == 200:
        existing_titles = {row["title"] for row in existing_resp.json()}

    inserted = 0
    skipped = 0
    for challenge in CHALLENGES:
        if challenge["title"] in existing_titles:
            print(f"  [skip] {challenge['title']}")
            skipped += 1
            continue

        resp = requests.post(endpoint, headers=HEADERS, json=challenge)
        if resp.status_code in (200, 201):
            print(f"  [ok]   {challenge['title']}")
            inserted += 1
        else:
            print(f"  [err]  {challenge['title']} → {resp.status_code}: {resp.text}")

    print(f"\nDone. {inserted} inserted, {skipped} skipped (already existed).")


if __name__ == "__main__":
    main()
