# Workflow de Développement

Ce projet est configuré pour offrir une expérience de développement fluide utilisant Docker.

## Architecture en Développement

En mode développement, nous utilisons deux conteneurs distincts qui communiquent entre eux :

1.  **Container API (`api`)** : Exécute FastAPI avec `uvicorn` (via `fastapi dev` ou `run`). Il écoute sur le port interne `8000`.
2.  **Container SPA (`spa`)** : Exécute le serveur de développement Vite. Il écoute sur le port `5173`.

### Fonctionnement du Proxy

Pour éviter les problèmes de CORS (Cross-Origin Resource Sharing) et simplifier les appels API depuis le frontend, nous utilisons le **Proxy de Vite**.

*   Le navigateur accède à l'application via `http://localhost:5173`.
*   Lorsqu'une requête est faite vers `/api/...`, le serveur Vite (dans le conteneur `spa`) intercepte cette requête.
*   Il la redirige vers le conteneur `api` sur le port `8000`.
*   Le navigateur a l'illusion de ne parler qu'à un seul serveur.

### Hot Reload (HMR)

Grâce aux volumes Docker montés dans `docker-compose.yml` (`./spa:/app`), toute modification de fichier dans votre dossier local `spa/` est immédiatement détectée par le conteneur. Vite recompyle instantanément la partie modifiée et met à jour le navigateur sans rechargement complet.
