# Implémentation Actuelle

## Solution de Production Choisie

**✅ Solution B implémentée** : FastAPI sert le Frontend

Comme décrit dans [production-strategy.md](./production-strategy.md), nous avons choisi la **Solution B** pour sa simplicité de déploiement.

### Comment ça fonctionne

1. **Build Frontend** : Le Dockerfile de production (`Dockerfile.prod`) utilise un build multi-stage :
   - **Stage 1** : Build du frontend React avec Node.js (`npm run build`)
   - **Stage 2** : Copie du dossier `dist/` dans le conteneur Python

2. **Configuration FastAPI** : Le fichier `app/main.py` détecte automatiquement si le dossier `dist/` existe et configure le serveur :
   ```python
   # Monte les assets statiques (JS, CSS, images)
   app.mount("/assets", StaticFiles(directory="dist/assets"), name="static")

   # Sert index.html pour toutes les routes non-API (SPA routing)
   @app.get("/{full_path:path}")
   async def serve_spa(full_path: str):
       # Sert index.html pour permettre le routing client-side de React
   ```

3. **Routing** :
   - `/api/*` → Endpoints de l'API FastAPI
   - `/assets/*` → Fichiers statiques (JS, CSS, images)
   - `/*` → Renvoie `index.html` (routing React côté client)

### Avantages de cette approche

- ✅ Un seul conteneur à déployer
- ✅ Configuration simple
- ✅ Pas de proxy à gérer
- ✅ Idéal pour les petits projets et MVP

### Inconvénients

- ⚠️ Python/FastAPI est moins performant que Nginx pour servir des fichiers statiques
- ⚠️ Couplage entre frontend et backend

### Pour passer à la Solution A (Nginx)

Si votre application devient plus importante et nécessite de meilleures performances, vous pouvez :
1. Ajouter un conteneur Nginx
2. Configurer Nginx pour servir les fichiers statiques
3. Proxy les requêtes `/api` vers FastAPI

Voir [production-strategy.md](./production-strategy.md) pour plus de détails sur la Solution A.

## Fichiers de Configuration

- **Développement** : `docker-compose.yml` (2 conteneurs séparés)
- **Production** : `docker-compose.prod.yml` + `Dockerfile.prod` (1 conteneur)

Voir le [README.md](../README.md) principal pour les instructions d'utilisation.
