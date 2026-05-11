"""
Trame du Questionnaire "Bilan Carbone" (Documentation)
=======================================================

🍎 1. Alimentation (Hebdomadaire)
Pour l'API ADEME

Question : Sur une semaine type (qui compte en moyenne 14 repas principaux : midi et soir), combien de fois consommez-vous les plats suivants ?

Champs numériques pour l'utilisateur :

Ce que le code attend :
La fonction ajouter_repas(type_repas, quantite) sera appelée pour chaque ligne où l'utilisateur a entré un nombre supérieur à 0.
**API utilisée** : ADEME
**Entrée attendue** :
	- Pour chaque type de repas (bœuf, volaille, poisson, végétarien, végétalien), un nombre de repas par semaine (ex : 3).
	- La fonction `ajouter_repas(type_repas, quantite)` est appelée pour chaque type où la quantité > 0.

💻 2. Numérique
Pour l'API ADEME

Question : En moyenne, combien d'heures par semaine passez-vous à regarder des vidéos en streaming (Netflix, YouTube, Prime, etc.) ?

Champs numériques pour l'utilisateur :

Ce que le code attend :
Un nombre (les heures, par exemple 10).
**API utilisée** : ADEME
**Entrée attendue** :
	- Un nombre d'heures de streaming par semaine (ex : 10).

🏠 3. Énergie & Logement
Pour l'API Climatiq

Question 1 (Électricité) : Quelle est la consommation électrique de votre foyer sur l'année ? (Cette information se trouve sur votre facture annuelle d'électricité).

Ce que le code attend :
Un nombre en kWh (ex: 150).

Question 2 (Chauffage au gaz) : Si vous êtes chauffé au gaz naturel, quelle est votre consommation annuelle ?
- Consommation de gaz : [ ___ kWh ]

Ce que le code attend :
Un nombre en kWh (ex: 500).
**API utilisée** : Climatiq
**Question 1 (Électricité)** :
	- **Entrée attendue** : un nombre en kWh pour la consommation électrique annuelle (ex : 150).
**Question 2 (Chauffage au gaz)** :
	- **Entrée attendue** : un nombre en kWh pour la consommation de gaz annuelle (ex: 500).

🚗 4. Transports & Mobilité
Pour l'API Carbon Interface

Question 1 (Voiture) : Quelle distance parcourez-vous en voiture (en tant que conducteur ou passager) sur une semaine type ?

Ce que le code attend :
Un nombre en kilomètres (ex: 150).
**API utilisée** : Carbon Interface
**Question 1 (Voiture)** :
	- **Entrée attendue** : un nombre en kilomètres parcourus en voiture par semaine (ex : 150).
**Question 2 (Avion)** :
	- **Entrée attendue** : deux codes IATA d’aéroports en majuscules (ex : 'CDG' pour Paris, 'JFK' pour New York).

Question 2 (Avion) : Sur l'année écoulée, avez-vous pris l'avion ? Si oui, précisez votre trajet principal.
- Départ : [ Menu déroulant ]
- Arrivée : [ Menu déroulant ]

Ce que le code attend :
Deux codes IATA d'aéroports en majuscules (ex: 'CDG' pour Paris, 'JFK' pour New York).
"""
