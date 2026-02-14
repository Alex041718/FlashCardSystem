import './FlashCard.scss';

interface FlashCardProps {
  entry: string;
  value: string;
  isFlipped: boolean;
  onClick: () => void;
}

const FlashCard = ({ entry, value, isFlipped, onClick }: FlashCardProps) => {
  return (
    <div className="flashcard" onClick={onClick}>
      <div className={`flashcard__inner ${isFlipped ? 'flashcard__inner--flipped' : ''}`}>
        <div className="flashcard__face flashcard__face--front">
          <div className="flashcard__content">
            <div className="flashcard__label">Question</div>
            <div className="flashcard__text">{entry}</div>
          </div>
          <div className="flashcard__hint">Cliquez pour voir la réponse</div>
        </div>
        <div className="flashcard__face flashcard__face--back">
          <div className="flashcard__content">
            <div className="flashcard__label">Réponse</div>
            <div className="flashcard__text">{value}</div>
          </div>
          <div className="flashcard__hint">Cliquez pour la carte suivante</div>
        </div>
      </div>
    </div>
  );
};

export default FlashCard;
