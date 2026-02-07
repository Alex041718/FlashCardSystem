# Simple Flashcard App

Une application de gestion de flashcards construite avec **FastAPI** (Backend) et **React/Vite** (Frontend), entièrement conteneurisée avec Docker.

## 🏗 Architecture

Le projet est divisé en deux parties principales :

*   **Backend (`/app`)** : Une API RESTful en Python (FastAPI) utilisant SQLite pour le stockage.
*   **Frontend (`/spa`)** : Une Single Page Application (SPA) en React avec TypeScript et Vite.

L'ensemble est orchestré par **Docker Compose** pour un environnement de développement fluide.

## 🚀 Démarrage Rapide

### Prérequis

*   Docker Desktop installé et lancé.

### Lancer le projet

1.  Clonez le dépôt (si ce n'est pas déjà fait).
2.  Renommer le fichier `.env.example` en `.env` et configurez les variables d'environnement si nécessaire (ex: `API_PORT`).
3.  Lancez les conteneurs :

```bash
docker-compose up --build
```

Une fois les conteneurs démarrés :

*   📱 **Application Frontend** : [http://localhost:5173](http://localhost:5173)
*   ⚙️ **Documentation API (Swagger)** : [http://localhost:8000/docs](http://localhost:8000/docs)

## 🛠 Développement

Le projet est configuré pour le **Hot Reload** (rechargement à chaud) :

*   Si vous modifiez un fichier dans `spa/src/`, le frontend se met à jour automatiquement.
*   Si vous modifiez le code Python dans `app/`, le backend peut nécessiter un redémarrage (selon la configuration `fastapi dev` ou `run` dans le Dockerfile).

### Ports

Les ports sont configurables via le fichier `.env` (pour l'API) et `docker-compose.yml`.

*   **API** : Port 8000 (par défaut)
*   **SPA** : Port 5173 (pour le développement avec Vite pour l'instant)

## 📚 Documentation

*   [Workflow de Développement](./docs/development-workflow.md)
*   [Stratégie de Production](./docs/production-strategy.md)
