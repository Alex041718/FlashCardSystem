import './CardListItem.scss';
import type { CardResponse } from '../models/Card';

interface CardListItemProps {
  card: CardResponse;
}

const CardListItem = ({ card }: CardListItemProps) => {
  return (
    <div className="card-list-item">
      <div className="card-list-item__content">
        <div className="card-list-item__entry">
          <span className="card-list-item__label">Q:</span>
          <span className="card-list-item__text">{card.entry}</span>
        </div>
        <div className="card-list-item__value">
          <span className="card-list-item__label">R:</span>
          <span className="card-list-item__text">{card.value}</span>
        </div>
        {card.hint && (
          <div className="card-list-item__hint">
            <span className="card-list-item__label">💡</span>
            <span className="card-list-item__text">{card.hint}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default CardListItem;
