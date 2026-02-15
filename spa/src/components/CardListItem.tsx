import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import './CardListItem.scss';
import type { CardResponse } from '../models/Card';

interface CardListItemProps {
  card: CardResponse;
  onDelete: (id: number) => void;
}

const CardListItem = ({ card, onDelete }: CardListItemProps) => {
  return (
    <div className="card-list-item">
      <div className="card-list-item__actions">
        <IconButton 
          onClick={() => onDelete(card.id)} 
          size="small" 
          aria-label="delete"
          color="default"
        >
          <DeleteIcon fontSize="small" />
        </IconButton>
      </div>
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
