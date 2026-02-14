import './CollectionCard.scss';
import type { CollectionResponse } from '../models/Collection';

interface CollectionCardProps {
  collection: CollectionResponse;
  onClick: () => void;
}

const CollectionCard = ({ collection, onClick }: CollectionCardProps) => {
  return (
    <div
      className="collection-card"
      onClick={onClick}
      style={collection.color ? { borderLeft: `4px solid ${collection.color}` } : {}}
    >
      <div className="collection-card__header">
        <h3 className="collection-card__name">{collection.name}</h3>
        {collection.isFavorite && (
          <span className="collection-card__favorite">⭐</span>
        )}
      </div>
      {collection.createdOn && (
        <p className="collection-card__date">
          Créé le {new Date(collection.createdOn).toLocaleDateString('fr-FR')}
        </p>
      )}
    </div>
  );
};

export default CollectionCard;
