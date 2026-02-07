# Stratégie de Production

Contrairement au développement, en production, nous ne voulons pas faire tourner le serveur de développement Vite (qui est lent et gourmand). Nous voulons servir des fichiers statiques optimisés.

## Étape 1 : Le Build

La première étape pour la production est toujours de compiler l'application React :

```bash
cd spa
npm run build
```

Cela génère un dossier `dist/` contenant :
*   `index.html` : Le point d'entrée.
*   `assets/` : Vos fichiers JavaScript et CSS minifiés et optimisés.

## Étape 2 : Servir l'application

Il existe deux stratégies principales pour servir ces fichiers et votre API.

### Option A : Serveur Web Dédié (Recommandé - Nginx)

C'est l'architecture la plus robuste et performante.

*   **Conteneur Nginx** : Il écoute sur le port 80 (ou 443).
    *   Si l'URL commence par `/api`, il redirige vers le conteneur Python.
    *   Sinon, il renvoie les fichiers statiques du dossier `dist/`.
*   **Conteneur API** : Ne gère que les données JSON.

**Avantages** : Nginx est très rapide pour servir des fichiers statiques, gère le cache, la compression Gzip/Brotli, et le SSL.

### Option B : FastAPI sert le Frontend ("Monolithique")

C'est une solution plus simple à déployer pour des petits projets car tout tient dans un seul conteneur.

1.  Lors du build Docker, on copie le dossier `dist/` généré dans le conteneur Python.
2.  On configure FastAPI pour servir ces fichiers :

```python
from fastapi.staticfiles import StaticFiles

app.mount("/", StaticFiles(directory="dist", html=True),ZX name="static")
```

**Avantages** : Un seul service à gérer/déployer.
**Inconvénients** : Python est moins performant que Nginx pour servir des fichiers statiques ; couplage fort entre frontend et backend.
