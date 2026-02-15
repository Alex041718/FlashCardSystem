import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from '@mui/material';
import { deleteCard } from '../services/cardService';
import { showSuccess, showError } from '../utils/toast';

interface DeleteCardModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  cardId: number | null;
}

const DeleteCardModal = ({ open, onClose, onSuccess, cardId }: DeleteCardModalProps) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    if (!cardId) return;

    setLoading(true);
    try {
      await deleteCard(cardId);
      showSuccess('Flashcard supprimée avec succès');
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting card:', error);
      showError('Erreur lors de la suppression de la flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Supprimer la flashcard ?</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer cette flashcard ? Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading} color="primary">
          Annuler
        </Button>
        <Button onClick={handleConfirm} disabled={loading} color="error" autoFocus>
          {loading ? 'Suppression...' : 'Supprimer'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteCardModal;
