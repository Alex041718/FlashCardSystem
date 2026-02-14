import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import './Dashboard.scss';
import { getCollections } from '../services/collectionService';
import { getCardsByCollection } from '../services/cardService';
import type { CollectionResponse } from '../models/Collection';
import KpiCard from '../components/KpiCard';
import CollectionCard from '../components/CollectionCard';
import AddCollectionModal from '../components/AddCollectionModal';
import Loader from '../components/Loader';
import { showError } from '../utils/toast';

const Dashboard = () => {
  const navigate = useNavigate();
  const [collections, setCollections] = useState<CollectionResponse[]>([]);
  const [totalCards, setTotalCards] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const collectionsData = await getCollections();
      setCollections(collectionsData);

      // Calculate total cards across all collections
      let cardCount = 0;
      for (const collection of collectionsData) {
        try {
          const cards = await getCardsByCollection(collection.id);
          cardCount += cards.length;
        } catch (error) {
          console.error(`Error loading cards for collection ${collection.id}:`, error);
        }
      }
      setTotalCards(cardCount);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      showError('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCollectionClick = (collectionId: number) => {
    navigate(`/collection/${collectionId}`);
  };

  const handleModalSuccess = () => {
    loadData();
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard__container">
        <header className="dashboard__header">
          <h1 className="dashboard__title">Mes Flashcards</h1>
        </header>

        <section className="dashboard__kpis">
          <KpiCard label="Collections" value={collections.length} icon="📚" />
          <KpiCard label="Flashcards" value={totalCards} icon="🎴" />
        </section>

        <section className="dashboard__collections">
          <h2 className="dashboard__section-title">Collections</h2>
          {collections.length === 0 ? (
            <div className="dashboard__empty">
              <p>Aucune collection pour le moment.</p>
              <p>Cliquez sur le bouton + pour créer votre première collection !</p>
            </div>
          ) : (
            <div className="dashboard__grid">
              {collections.map((collection) => (
                <CollectionCard
                  key={collection.id}
                  collection={collection}
                  onClick={() => handleCollectionClick(collection.id)}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      <Fab
        color="primary"
        aria-label="add"
        className="dashboard__fab"
        onClick={() => setModalOpen(true)}
      >
        <AddIcon />
      </Fab>

      <AddCollectionModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={handleModalSuccess}
      />
    </div>
  );
};

export default Dashboard;
