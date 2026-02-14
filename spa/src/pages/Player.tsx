import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import './Player.scss';
import { getCardsByCollection } from '../services/cardService';
import type { CardResponse } from '../models/Card';
import FlashCard from '../components/FlashCard';
import Loader from '../components/Loader';
import { showError } from '../utils/toast';

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const Player = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCards = async () => {
      if (!id) return;

      setLoading(true);
      try {
        const cardsData = await getCardsByCollection(Number(id));
        if (cardsData.length === 0) {
          showError('Aucune flashcard dans cette collection');
          navigate(`/collection/${id}`);
          return;
        }
        // Shuffle cards for random order
        const shuffled = shuffleArray(cardsData);
        setCards(shuffled);
      } catch (error) {
        console.error('Error loading cards:', error);
        showError('Erreur lors du chargement des flashcards');
        navigate(`/collection/${id}`);
      } finally {
        setLoading(false);
      }
    };

    loadCards();
  }, [id, navigate]);

  const handleCardClick = () => {
    if (!isFlipped) {
      // First click: flip to show answer
      setIsFlipped(true);
    } else {
      // Second click: go to next card or finish
      if (currentIndex < cards.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setIsFlipped(false);
      } else {
        // Finished all cards
        navigate(`/congratulations/${id}`);
      }
    }
  };

  const handleExit = () => {
    navigate(`/collection/${id}`);
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (cards.length === 0) {
    return null;
  }

  const currentCard = cards[currentIndex];

  return (
    <div className="player">
      <div className="player__header">
        <div className="player__progress">
          {currentIndex + 1} / {cards.length}
        </div>
        <Button
          startIcon={<CloseIcon />}
          onClick={handleExit}
          className="player__exit"
          color="inherit"
        >
          Quitter
        </Button>
      </div>

      <div className="player__content">
        <FlashCard
          entry={currentCard.entry}
          value={currentCard.value}
          isFlipped={isFlipped}
          onClick={handleCardClick}
        />
      </div>

      <div className="player__footer">
        <div className="player__progress-bar">
          <div
            className="player__progress-fill"
            style={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;
