# Architecture API Frontend

Ce document décrit l'architecture de communication entre le frontend (Single Page Application) et l'API backend.

## Client HTTP (`src/api/client.ts`)

Nous utilisons la bibliothèque **Axios** pour effectuer toutes les requêtes HTTP. Une instance unique et centralisée est configurée dans le fichier [`spa/src/api/client.ts`](../spa/src/api/client.ts).

### Configuration
*   **Base URL** : `/api`
    *   Cette URL relative est essentielle. Elle permet au client de fonctionner de manière transparente :
        *   **En développement** : Les requêtes sont interceptées par le proxy Vite et redirigées vers le backend (voir [Workflow de Développement](./development-workflow.md)).
        *   **En production** : Nginx ou un autre serveur web servira les fichiers statiques et proxyera les requêtes `/api` vers le serveur d'application.
*   **Headers** : `Content-Type: application/json` est défini par défaut pour toutes les requêtes.

## Couche de Service (`src/services/`)

Afin de respecter le principe de séparation des préoccupations (Separation of Concerns), **les composants React ne doivent jamais appeler Axios directement**. Ils doivent passer par des fonctions de service dédiées.

Cette couche d'abstraction permet de :
1.  Centraliser la logique d'appel API.
2.  Gérer le typage TypeScript des réponses et des requêtes.
3.  Faciliter la maintenance et le testing.

### Organisation des Services

Les services sont organisés par domaine métier dans le dossier [`spa/src/services/`](../spa/src/services/) :

*   **[`collectionService.ts`](../spa/src/services/collectionService.ts)** : Gère les collections (thèmes).
    *   `getCollections()` : Récupère la liste de toutes les collections.
    *   `getCollection(id)` : Récupère une collection spécifique.
    *   `createCollection(data)`, `updateCollection(id, data)`, `deleteCollection(id)`.
*   **[`cardService.ts`](../spa/src/services/cardService.ts)** : Gère les cartes (flashcards).
    *   `getCardsByCollection(collectionId)` : Récupère les cartes associées à une collection.
    *   Opérations CRUD standards (`createCard`, `getCard`, `updateCard`, `deleteCard`).

### Typage TypeScript

L'utilisation de TypeScript est stricte. Chaque fonction de service retourne une `Promise` typée avec les interfaces définies dans `src/models/`.

Exemple :
```typescript
// La fonction garantit qu'elle retournera un tableau d'objets CollectionResponse
export const getCollections = async (): Promise<CollectionResponse[]> => { ... };
```

## Exemple d'Utilisation dans un Composant

Voici un exemple concret montrant comment consommer ces services dans un composant React avec les Hooks `useEffect` et `useState`.

```tsx
import { useEffect, useState } from 'react';
// Import du service spécifique
import { getCollections } from '../services/collectionService';
// Import du type pour la sécurité du code
import type { CollectionResponse } from '../models/Collection';

const MyCollectionList = () => {
  const [collections, setCollections] = useState<CollectionResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Appel asynchrone au service
        const data = await getCollections();
        setCollections(data);
      } catch (err) {
        console.error("Erreur API:", err);
        setError("Impossible de charger les collections.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []); // Le tableau vide [] assure que l'appel ne se fait qu'au montage du composant

  if (isLoading) return <div>Chargement en cours...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="collection-list">
      <h2>Mes Collections</h2>
      <ul>
        {collections.map((col) => (
          <li key={col.id}>
            {col.name} ({col.difficulty})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyCollectionList;
```
