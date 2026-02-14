import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { Fab, Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './CollectionDetail.scss';
import { getCollection } from '../services/collectionService';
import { getCardsByCollection } from '../services/cardService';
import type { CollectionResponse } from '../models/Collection';
import type { CardResponse } from '../models/Card';
import CardListItem from '../components/CardListItem';
import AddCardModal from '../components/AddCardModal';
import Loader from '../components/Loader';
import { showError } from '../utils/toast';

const CollectionDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [collection, setCollection] = useState<CollectionResponse | null>(null);
  const [cards, setCards] = useState<CardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    if (!id) return;

    setLoading(true);
    try {
      const [collectionData, cardsData] = await Promise.all([
        getCollection(Number(id)),
        getCardsByCollection(Number(id)),
      ]);
      setCollection(collectionData);
      setCards(cardsData);
    } catch (error) {
      console.error('Error loading collection data:', error);
      showError('Erreur lors du chargement de la collection');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleModalSuccess = () => {
    loadData();
  };

  const handlePlay = () => {
    navigate(`/player/${id}`);
  };

  const handleBack = () => {
    navigate('/');
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  if (!collection) {
    return (
      <div className="collection-detail">
        <div className="collection-detail__error">
          <p>Collection introuvable</p>
          <Button variant="contained" onClick={handleBack}>
            Retour au dashboard
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="collection-detail">
      <div className="collection-detail__container">
        <header className="collection-detail__header">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="collection-detail__back"
          >
            Retour
          </Button>
          <h1 className="collection-detail__title">{collection.name}</h1>
          {collection.isFavorite && (
            <span className="collection-detail__favorite">⭐</span>
          )}
        </header>

        <section className="collection-detail__cards">
          <div className="collection-detail__cards-header">
            <h2 className="collection-detail__section-title">
              Flashcards ({cards.length})
            </h2>
          </div>

          {cards.length === 0 ? (
            <div className="collection-detail__empty">
              <p>Aucune flashcard pour le moment.</p>
              <p>Cliquez sur le bouton + pour ajouter votre première flashcard !</p>
            </div>
          ) : (
            <div className="collection-detail__list">
              {cards.map((card) => (
                <CardListItem key={card.id} card={card} />
              ))}
            </div>
          )}
        </section>
      </div>

      {cards.length > 0 && (
        <div className="collection-detail__play-container">
          <Button
            variant="contained"
            size="large"
            startIcon={<PlayArrowIcon />}
            onClick={handlePlay}
            className="collection-detail__play-button"
            fullWidth
          >
            Jouer
          </Button>
        </div>
      )}

      <Fab
        color="primary"
        aria-label="add"
        className="collection-detail__fab"
        onClick={() => setModalOpen(true)}
      >
        <AddIcon />
      </Fab>

      <AddCardModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
        collectionId={Number(id)}
      />
    </div>
  );
};

export default CollectionDetail;
