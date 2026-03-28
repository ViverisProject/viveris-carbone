from pydantic import BaseModel
from typing import Optional

class CO2Counter(BaseModel):
    id: Optional[int] = None
    value: float
    unit: str = "kg"
    description: Optional[str] = None

# Simuler une base de données en mémoire

co2_counter_db = {"counter": CO2Counter(id=1, value=0.0, unit="kg", description="Compteur de CO2 total")}

# ==========================================
# 1. API ADEME (Impact CO2) - Alimentation 
# ==========================================
def ajouter_repas(type_repas: str, quantite: int = 1):
    """
    Calcule l'impact pour un ou plusieurs repas du même type.
    Types acceptés : 'boeuf', 'poulet', 'poisson', 'vegetarien', 'vegetalien'.
    """
    print(f"-> Calcul ADEME pour {quantite} repas de type : {type_repas}...")
    # Valeurs moyennes en kg CO2e pour 1 repas
    valeurs_moyennes_ademe = {
        "boeuf": 7.26,
        "poulet": 1.58,
        "poisson": 1.96,
        "vegetarien": 0.51,
        "vegetalien": 0.31
    }
    # On récupère l'émission pour 1 repas
    emission_unitaire = valeurs_moyennes_ademe.get(type_repas.lower(), 0)
    # On multiplie par le nombre de repas
    emission_totale = emission_unitaire * quantite
    co2_counter_db["counter"].value += emission_totale
    print(f"[+] {emission_totale:.2f} kg CO2e ajoutés au compteur (pour {quantite} repas).\n")
