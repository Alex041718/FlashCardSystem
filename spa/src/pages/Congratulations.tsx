import { useParams, useNavigate } from 'react-router';
import { Button } from '@mui/material';
import './Congratulations.scss';

const Congratulations = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/collection/${id}`);
  };

  return (
    <div className="congratulations">
      <div className="congratulations__content">
        <div className="congratulations__emoji">
          <span className="congratulations__firework">🎉</span>
          <span className="congratulations__firework">🎊</span>
          <span className="congratulations__firework">✨</span>
        </div>

        <h1 className="congratulations__title">Bravo !</h1>

        <p className="congratulations__message">
          Vous avez terminé toutes les flashcards de cette collection !
        </p>

        <div className="congratulations__emoji-large">
          <span>🏆</span>
        </div>

        <Button
          variant="contained"
          size="large"
          onClick={handleContinue}
          className="congratulations__button"
        >
          Continuer
        </Button>
      </div>
    </div>
  );
};

export default Congratulations;
