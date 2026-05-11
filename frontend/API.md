# API utilisée par le frontend

Cette documentation couvre les endpoints utilisés par le frontend de l'application Viveris Carbone. Les shapes JSON sont adaptées exactement aux clés utilisées côté front (noms de champs et structure identiques à `sessionStorage` / objets manipulés).

Base URL: `https://api.example.com` (remplacez par l'URL réelle)

Auth (recommandé)

## GET /api/quiz/questions

- Méthode: `GET`
- Route: `/api/quiz/questions`
- Description: retourne la liste complète des questions du quiz, dans le même format que la constante `questions` actuellement utilisée côté front.
- Corps de la requête: aucun.
- Headers recommandés: `Accept: application/json`, `Authorization: Bearer <token>` (si nécessaire)

### Réponse (200)
Un tableau d'objets question. Format exact attendu par le front:

```json
[
  {
    "id": 1,
    "category": "Transport",
    "question": "Combien de kilomètres parcourez-vous en voiture par semaine ?",
    "options": [
      { "label": "0-20 km", "value": 10, "co2": 20 },
      { "label": "20-50 km", "value": 35, "co2": 70 }
    ]
  },
  {
    "id": 2,
    "category": "Transport",
    "question": "Combien de vols en avion prenez-vous par an ?",
    "options": [
      { "label": "Aucun", "value": 0, "co2": 0 },
      { "label": "1-2 vols courts courriers", "value": 1, "co2": 400 }
    ]
  }
]
```

> Remarque: les champs `label`, `value`, `co2` doivent être fournis exactement ainsi. `id` est un entier unique par question.

### Erreurs possibles
- `401 Unauthorized` — token manquant / invalide (si auth requise)
- `500 Internal Server Error`
```bash
curl -X GET "https://api.example.com/api/quiz/questions" \
---

## POST /api/emissions/save

- Méthode: `POST`
- Route: `/api/emissions/save`
- Description: sauvegarde le résultat du quiz et les prédictions (choix de flexibilité) de l'utilisateur. Le frontend envoie les clés `quizResult` et `userPredictions` (notamment l'objet `answers`). IMPORTANT : le serveur doit recalculer de manière autoritaire l'empreinte à partir des `answers` fournies (en utilisant la source canonique des questions/coefs côté serveur) et renvoyer les résultats calculés (`quizResult`, `categoryEmissions`, `targetCO2`). Le champ `quizResult.totalInTons` envoyé par le client ne doit pas être considéré comme source de vérité.
- Headers requis: `Content-Type: application/json`, `Authorization: Bearer <token>` (si lié à un compte utilisateur)

### Corps attendu (JSON) — keys identiques au front

Le frontend utilise les clés suivantes dans `sessionStorage`:

- `quizResult` — objet contenant `totalInTons` et `answers`.
  - `totalInTons`: valeur envoyée par le front (ex: "2.8"), mais le serveur doit recalculer et renvoyer sa propre valeur numérique.
  - `answers`: objet dont les clés sont les `id` des questions (sous forme de string) et les valeurs sont les options sélectionnées (objet `{ label, value, co2 }`). Le serveur utilise ces `answers` pour effectuer le calcul.

- `userPredictions` — objet contenant deux tableaux de slugs de domaines: `highestConsumption` et `flexibility`.
  - `highestConsumption`: tableau de slugs (ex: `["transport","food"]`) — facultatif mais accepté.
  - `flexibility`: tableau de 1 à 3 slugs (ex: `["energy","transport"]`) — requis selon validation.

Exemple de payload envoyé par le front (les mêmes clés que précédemment):

```json
{
  "quizResult": {
    "totalInTons": "2.8",
    "answers": {
      "1": { "label": "0-20 km", "value": 10, "co2": 20 },
      "2": { "label": "Aucun", "value": 0, "co2": 0 }
    }
> Validation recommandée côté serveur:
- `userPredictions.flexibility` doit contenir entre 1 et 3 éléments (renvoyer `400` si hors limite).
### Comportement serveur (obligatoire)

- Charger la source canonique des questions/coûts côté serveur (coefficients `co2` fiables).
- Recalculer l'empreinte totale et la répartition par catégorie à partir de `answers` (ne pas faire confiance au `totalInTons` client).
- Produire un objet `quizResult` calculé côté serveur contenant au minimum `totalInTons` (number) et `categoryBreakdown`.
- Retourner `categoryEmissions` complet (répartition) et `targetCO2` (valeur cible / objectif si applicable).
- Sauvegarder l'enregistrement (lier à `user` si connecté) et renvoyer un `emissionId` / `savedAt` pour traçabilité.

### Réponse (200) — confirmation (serveur-calculé)
  "success": true,
  "emissionId": "em_2026_0001",
  "quizResult": {
    "totalInTons": 2.3,
    "categoryBreakdown": {
      "Transport": 1.0,
      "Alimentation": 0.5,
      "Énergie": 0.6,
      "Consommation": 0.2
    }
  },
  "categoryEmissions": {
    "Transport": 1.0,
    "Alimentation": 0.5,
    "Énergie": 0.6,
    "Consommation": 0.2
  },
  "targetCO2": 2.3,
  "savedAt": "2026-05-11T14:12:00Z"
}
```

### Erreurs possibles
- `400 Bad Request` — payload invalide (ex: `flexibility` vide ou >3, ou `answers` absent). Exemple:

```json
{ "success": false, "error": "ValidationError", "details": ["flexibility must contain 1..3 items", "answers is required"] }
```

- `401 Unauthorized` — token manquant / invalide (si auth requise)
- `500 Internal Server Error`

### Exemple (curl)
```bash
curl -X POST "https://api.example.com/api/emissions/save" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "quizResult": { "answers": {"1": {"label":"0-20 km","value":10,"co2":20}}},
    "userPredictions": {"flexibility":["transport","energy"]}
  }'
```

### Recommandations d'implémentation
- Le backend est la source de vérité pour le calcul des émissions. Le front peut envoyer son propre total pour compatibilité, mais le serveur recalcule et renvoie la valeur finale.
- Retourner `emissionId`, `savedAt`, `quizResult` (serveur) et `categoryEmissions` pour synchroniser immédiatement le front (mettre à jour `sessionStorage` / `localStorage`).
- Accepter `totalInTons` en string ou number côté serveur si fourni, mais l'ignorer pour le calcul.
- Prévoir un `idempotencyKey` (facultatif) si le front peut renvoyer plusieurs fois la même sauvegarde.
- Si l'application supporte le mode offline, accepter un `clientId` pour relier les sauvegardes anonymes à un compte ultérieurement.

---

## Notes générales
- Les clés et structures documentées ci‑dessus reprennent exactement les noms utilisés côté frontend (`quizResult`, `totalInTons`, `answers`, `userPredictions`, `flexibility`, ...).
- Si vous voulez que le backend renvoie des identifiants internes (ex: `emissionId`), ajoutez-les dans la réponse (`savedAt`, `emissionId`).

---

---

## 3. Tableau de bord & Profil

L'utilisateur doit pouvoir récupérer ses données de profil et statistiques pour alimenter le `Dashboard` et la page `Profile`.

### GET /api/users/me

- Méthode: `GET`
- Route: `/api/users/me`
- Description: retourne les informations de l'utilisateur connecté (profil) ainsi que ses statistiques : empreinte totale, répartition par catégorie, points, arbres plantés, succès (achievements), séries (streaks). Le front n'envoie rien dans le corps, seulement le jeton dans l'en‑tête.
- Headers: `Authorization: Bearer <token>`, `Accept: application/json`

### Réponse (200)
Format exact recommandé (keys compatibles avec les attentes front utilisées ailleurs) :

```json
{
  "user": {
    "id": "user_123",
    "firstName": "Jean",
    "lastName": "Dupont",
    "email": "jean.dupont@example.com"
  },
  "quizResult": {
    "totalInTons": "2.8",
    "answers": { /* (optionnel) id -> {label,value,co2} */ },
    "categoryBreakdown": {
      "Transport": 1.8,
      "Alimentation": 1.2,
      "Énergie": 1.5,
      "Consommation": 0.7
    }
  },
  "categoryEmissions": {
    "Transport": 1.8,
    "Alimentation": 1.2,
    "Énergie": 1.5,
    "Consommation": 0.7
  },
  "points": 1240,
  "treesPlanted": 2,
  "achievements": [
    { "id": "first-tree", "name": "Premier arbre", "unlocked": true },
    { "id": "7-days", "name": "7 Jours consécutifs", "unlocked": true }
  ],
  "streak": 12,
  "bestStreak": 18
}
```

Notes d'intégration :
- `categoryEmissions` reprend exactement la clé utilisée par le front (`localStorage.setItem("categoryEmissions", ...)`). Le frontend peut écrire directement ce champ dans le `localStorage` pour garder la compatibilité.
- `quizResult` est fourni en option si vous souhaitez garder l'historique des réponses; `totalInTons` peut être string ou number.

### Erreurs possibles
- `401 Unauthorized` — jeton absent / invalide.
- `500 Internal Server Error`.

### Exemple (curl)
```bash
curl -X GET "https://api.example.com/api/users/me" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

---

## 4. Recalculer un domaine précis (PUT)

Le frontend permet à l'utilisateur de recalculer les émissions d'un seul domaine (ex: Transport) en ré-envoyant les réponses liées uniquement à ce domaine.

### PUT /api/emissions/category

- Méthode: `PUT`
- Route: `/api/emissions/category`
- Description: met à jour les émissions pour une catégorie précise en fonction des nouvelles réponses fournies pour cette catégorie. Le backend calcule le nouveau total pour la catégorie et renvoie le total mis à jour (et éventuellement le total global mis à jour).
- Headers: `Content-Type: application/json`, `Authorization: Bearer <token>` (recommandé)

### Corps attendu (exemple exact conforme au front)

```json
{
  "category": "Transport",
  "answers": {
    "1": { "label": "0-20 km", "value": 10, "co2": 20 },
    "2": { "label": "Aucun", "value": 0, "co2": 0 }
  }
}
```

Explication: `answers` est le même objet que celui construit côté `Dashboard` avant l'enregistrement ; les clés sont les `id` des questions et les valeurs sont les objets option sélectionnée.

### Réponse (200)

```json
{
  "success": true,
  "category": "Transport",
  "newCategoryTotal": 1.85,
  "categoryEmissions": {
    "Transport": 1.85,
    "Alimentation": 1.2,
    "Énergie": 1.5,
    "Consommation": 0.7
  },
  "updatedTotalInTons": 5.25,
  "savedAt": "2026-05-11T15:00:00Z"
}
```

Notes:
- `newCategoryTotal` est en tonnes (nombre). Le front peut afficher `toFixed(2)`.
- `categoryEmissions` contient la répartition complète mise à jour pour remplacer le `localStorage` existant.

### Erreurs possibles
- `400 Bad Request` — payload invalide (ex: `category` manquant ou `answers` invalide). Exemple:

```json
{ "success": false, "error": "ValidationError", "details": ["answers must include all required question ids for category Transport"] }
```

- `401 Unauthorized` — jeton manquant / invalide.
- `500 Internal Server Error`.

### Exemple (curl)
```bash
curl -X PUT "https://api.example.com/api/emissions/category" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "category": "Transport",
    "answers": {"1": {"label":"0-20 km","value":10,"co2":20}}
  }'
```

---

Si vous voulez, je peux générer automatiquement un spec OpenAPI (YAML) basé sur ces shapes ou ajouter des exemples Postman.

---

## 5. Les Défis (Gamification)

Le module Défis gère la sélection dynamique des challenges, la validation (toggle) et la création de défis personnalisés.

### GET /api/challenges/recommendations

- Méthode: `GET`
- Route: `/api/challenges/recommendations`
- Description: renvoie une liste d'environ 6 défis recommandés pour l'utilisateur, personnalisés selon son profil (flexibility / categoryEmissions). Le frontend n'envoie rien dans le corps.
- Headers: `Authorization: Bearer <token>` (recommandé), `Accept: application/json`

### Réponse (200)
Un tableau d'objets défi. Le front attend au minimum ces clés (identique à `data/challenges.json` + `completed`):

```json
[
  {
    "id": 31,
    "title": "Utiliser les transports en commun",
    "points": 20,
    "category": "Transport",
    "completed": false
  },
  {
    "id": 12,
    "title": "Cuisiner une recette végétalienne",
    "points": 40,
    "category": "Alimentation",
    "completed": true
  }
]
```

Notes:
- `completed` indique si l'utilisateur a déjà complété ce défi (utile pour l'UI). Le backend peut calculer ceci depuis l'historique utilisateur.
- Le backend peut inclure un champ optionnel `reason` (ex: "flexibility") pour expliquer la recommandation.

### Erreurs possibles
- `401 Unauthorized`
- `500 Internal Server Error`

### Exemple (curl)
```bash
curl -X GET "https://api.example.com/api/challenges/recommendations" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

---

### POST /api/challenges/{challengeId}/toggle

- Méthode: `POST`
- Route: `/api/challenges/{id}/toggle` (ex: `/api/challenges/31/toggle`)
- Description: valide ou annule la validation d'un défi pour l'utilisateur. Le front envoie l'état souhaité (`completed`) et le backend renvoie le nouveau solde de points et l'avancement des arbres.
- Headers: `Content-Type: application/json`, `Authorization: Bearer <token>`

### Corps attendu
```json
{ "completed": true }
```

### Réponse (200)
```json
{
  "success": true,
  "challengeId": 31,
  "completed": true,
  "pointsDelta": 20,
  "totalPoints": 2670,
  "treesPlanted": 2,
  "treeProgress": 67
}
```

Explications:
- `pointsDelta`: +points si `completed=true`, -points si `completed=false`.
- `totalPoints`: nouveau total de points de l'utilisateur.
- `treesPlanted`: nombre d'arbres plantés (par ex: `Math.floor(totalPoints/1000)`).
- `treeProgress`: pourcentage (0–100) vers l'arbre suivant, compatible avec l'affichage côté front.

### Erreurs possibles
- `400 Bad Request` — payload invalide
- `401 Unauthorized`
- `404 Not Found` — défi introuvable
- `500 Internal Server Error`

### Exemple (curl)
```bash
curl -X POST "https://api.example.com/api/challenges/31/toggle" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "completed": true }'
```

---

### POST /api/challenges

- Méthode: `POST`
- Route: `/api/challenges`
- Description: crée un nouveau défi personnalisé (ex: via `CreateChallengeModal`). Le frontend envoie `title`, `category` et `points`.
- Headers: `Content-Type: application/json`, `Authorization: Bearer <token>` (optionnel si vous autorisez créations anonymes)

### Corps attendu
```json
{
  "title": "Aller au travail à vélo",
  "category": "Transport",
  "points": 40
}
```

### Réponse (201)
```json
{
  "success": true,
  "challenge": {
    "id": 201,
    "title": "Aller au travail à vélo",
    "category": "Transport",
    "points": 40,
    "createdBy": "user_123",
    "createdAt": "2026-05-11T15:30:00Z",
    "completed": false
  }
}
```

### Erreurs possibles
- `400 Bad Request` — données manquantes ou invalides
- `401 Unauthorized` — si création réservée aux utilisateurs
- `500 Internal Server Error`

### Exemple (curl)
```bash
curl -X POST "https://api.example.com/api/challenges" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "title": "Aller au travail à vélo", "category": "Transport", "points": 40 }'
```

---

### Notes d'implémentation
- Le backend doit fusionner les recommandations avec l'état `completed` de l'utilisateur (historique stocké côté serveur).
- Valider les `points` côté serveur pour éviter fraude (ex: plage raisonnable 5–500).
- Pour synchronisation hors ligne, prévoir `clientId` ou `idempotencyKey` pour la création/toggle.

---

Si vous le souhaitez, je peux générer un spec OpenAPI (YAML) couvrant ces endpoints, ou créer une collection Postman importable pour tests rapides.

---

## 6. Communauté & Classement

Affiche le classement (podium + liste) des utilisateurs pour la page Communauté.

### GET /api/community/leaderboard

- Méthode: `GET`
- Route: `/api/community/leaderboard`
- Description: renvoie la liste des meilleurs utilisateurs (podium + classement complet). Le frontend n'envoie rien dans le corps — il fournit seulement le jeton si nécessaire.
- Headers: `Accept: application/json`, `Authorization: Bearer <token>` (optionnel selon configuration)

### Réponse (200)
Le backend renvoie un tableau d'objets utilisateur, ordonné par `points` décroissants. Champs utilisés par le front (identiques à ceux consommés dans `CommunityPage`):

```json
[
  { "rank": 1, "name": "Jordan Forest", "avatar": "JF", "points": 3200, "trees": 12, "percentage": 95 },
  { "rank": 2, "name": "Alex Rivers", "avatar": "AR", "points": 2800, "trees": 10, "percentage": 87 }
]
```

- `rank`: position dans le classement (number)
- `name`: pseudo / nom affiché (string)
- `avatar`: chaîne courte ou identifiant d'avatar (string)
- `points`: points totaux (number)
- `trees`: arbres "plantés" ou équivalent (number)
- `percentage`: (optionnel) score relatif pour affichage sur le podium (0–100)

Notes:
- Le backend peut renvoyer seulement les `top 3` puis le reste (comme le frontend le découpe en `topThree` et `restOfLeaderboard`).
- Optionnel: supporter query params comme `?limit=20` ou `?period=monthly` si besoin ultérieur — le front actuel n'envoie rien.

### Erreurs possibles
- `401 Unauthorized` — si accès restreint
- `500 Internal Server Error`

### Exemple (curl)
```bash
curl -X GET "https://api.example.com/api/community/leaderboard" \
  -H "Accept: application/json" \
  -H "Authorization: Bearer $TOKEN"
```

---

Si vous souhaitez, je peux maintenant générer un spec OpenAPI (YAML) couvrant tous les endpoints documentés, ou créer une collection Postman JSON prête à importer.
