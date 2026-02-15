# Simple Flashcard App

Une application de gestion de flashcards construite avec **FastAPI** (Backend) et **React/Vite** (Frontend), entièrement conteneurisée avec Docker.

## 🏗 Architecture

Le projet est divisé en deux parties principales :

*   **Backend (`/app`)** : Une API RESTful en Python (FastAPI) utilisant SQLite pour le stockage.
*   **Frontend (`/spa`)** : Une Single Page Application (SPA) en React avec TypeScript et Vite.

L'ensemble est orchestré par **Docker Compose** pour un environnement de développement fluide.

## 🚀 Démarrage

### Prérequis

*   Docker Desktop installé et lancé.

### Mode Développement

**Utilisez `docker-compose.yml` pour le développement :**

1.  Clonez le dépôt (si ce n'est pas déjà fait).
2.  Renommez le fichier `.env.example` en `.env` et configurez les variables d'environnement si nécessaire (ex: `API_PORT`).
3.  Renommez le fichier dB `db.example.db` en `db.db`
4.  Lancez les conteneurs :

```bash
docker compose up --build
```

Une fois les conteneurs démarrés :

*   📱 **Application Frontend** : [http://localhost:5173](http://localhost:5173) (Vite dev server)
*   ⚙️ **Documentation API (Swagger)** : [http://localhost:8000/docs](http://localhost:8000/docs)

**Architecture en développement :**
- 2 conteneurs séparés : `api` et `spa`
- Hot reload activé sur les deux
- Frontend servi par Vite (rapide, avec HMR)
- API accessible via proxy Vite

### Mode Production

**Utilisez `docker-compose.prod.yml` pour la production :**

```bash
docker compose -f docker-compose.prod.yml up --build
```

Une fois le conteneur démarré :

*   🌐 **Application complète** : [http://localhost:8000](http://localhost:8000)

**Architecture en production :**
- 1 seul conteneur contenant tout
- React buildé en fichiers statiques optimisés
- FastAPI sert à la fois l'API (`/api/*`) et le frontend (`/*`)
- Pas de serveur Vite, seulement FastAPI

**Le build de production :**
1. Compile le frontend React (`npm run build` → dossier `dist/`)
2. Copie les fichiers buildés dans le conteneur Python
3. FastAPI sert les fichiers statiques

### Arrêter l'application

```bash
# En développement
docker compose down

# En production
docker compose -f docker-compose.prod.yml down
```

## 🛠 Développement

Le projet est configuré pour le **Hot Reload** (rechargement à chaud) en mode développement :

*   Si vous modifiez un fichier dans `spa/src/`, le frontend se met à jour automatiquement.
*   Si vous modifiez le code Python dans `app/`, le backend redémarre automatiquement.

### Ports

**Mode développement (`docker-compose.yml`) :**
*   **API** : Port 8000 (configurable via `.env`)
*   **Frontend** : Port 5173 (Vite dev server)

**Mode production (`docker-compose.prod.yml`) :**
*   **Application complète** : Port 8000 (API + Frontend)

## 🚢 Mise en Production

### Procédure de déploiement

1. **Vérifiez que votre code est à jour et testé**
   ```bash
   # Testez en développement d'abord
   docker compose up --build
   ```

2. **Arrêtez les conteneurs de développement** (si actifs)
   ```bash
   docker compose down
   ```

3. **Lancez le build de production**
   ```bash
   docker compose -f docker-compose.prod.yml up --build -d
   ```

   L'option `-d` lance en mode détaché (background).

4. **Vérifiez que tout fonctionne**
   - Accédez à [http://localhost:8000](http://localhost:8000)
   - Testez la navigation et les fonctionnalités
   - Vérifiez les logs : `docker compose -f docker-compose.prod.yml logs -f`

5. **Pour mettre à jour l'application en production**
   ```bash
   # Arrêter
   docker compose -f docker-compose.prod.yml down

   # Rebuild et redémarrer
   docker compose -f docker-compose.prod.yml up --build -d
   ```

### Différences Dev vs Prod

| Aspect | Développement | Production |
|--------|---------------|------------|
| Fichier | `docker-compose.yml` | `docker-compose.prod.yml` |
| Conteneurs | 2 (api + spa) | 1 (app) |
| Frontend | Vite dev server | Fichiers statiques buildés |
| Hot reload | ✅ Oui | ❌ Non |
| URL | Frontend :5173, API :8000 | Tout sur :8000 |
| Performance | Développement | Optimisé |
| Build time | Rapide | Plus long (compile React) |

### Commandes utiles

```bash
# Voir les logs en production
docker compose -f docker-compose.prod.yml logs -f

# Voir uniquement les logs de l'app
docker compose -f docker-compose.prod.yml logs -f app

# Redémarrer sans rebuild
docker compose -f docker-compose.prod.yml restart

# Voir l'état des conteneurs
docker compose -f docker-compose.prod.yml ps
```

## 📚 Documentation

*   [Workflow de Développement](./docs/development-workflow.md)
*   [Stratégie de Production](./docs/production-strategy.md)
