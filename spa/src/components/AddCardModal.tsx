import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button } from '@mui/material';
import './AddCardModal.scss';
import { createCard } from '../services/cardService';
import { showSuccess, showError } from '../utils/toast';

interface AddCardModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
  collectionId: number;
}

const AddCardModal = ({ open, onClose, onSuccess, collectionId }: AddCardModalProps) => {
  const [entry, setEntry] = useState('');
  const [value, setValue] = useState('');
  const [hint, setHint] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ entry?: string; value?: string }>({});

  const handleClose = () => {
    if (!loading) {
      setEntry('');
      setValue('');
      setHint('');
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const newErrors: { entry?: string; value?: string } = {};

    if (!entry.trim()) {
      newErrors.entry = 'La question est obligatoire';
    }

    if (!value.trim()) {
      newErrors.value = 'La réponse est obligatoire';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    setLoading(true);
    try {
      await createCard({
        entry: entry.trim(),
        value: value.trim(),
        hint: hint.trim() || null,
        collectionId,
      });
      showSuccess('Flashcard créée avec succès !');
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating card:', error);
      showError('Erreur lors de la création de la flashcard');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nouvelle Flashcard</DialogTitle>
        <DialogContent>
          <div className="add-card-modal__form">
            <TextField
              label="Question (Entry)"
              value={entry}
              onChange={(e) => setEntry(e.target.value)}
              error={!!errors.entry}
              helperText={errors.entry}
              fullWidth
              required
              autoFocus
              disabled={loading}
              multiline
              rows={2}
            />

            <TextField
              label="Réponse (Value)"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              error={!!errors.value}
              helperText={errors.value}
              fullWidth
              required
              disabled={loading}
              multiline
              rows={3}
            />

            <TextField
              label="Indice (optionnel)"
              value={hint}
              onChange={(e) => setHint(e.target.value)}
              fullWidth
              disabled={loading}
              multiline
              rows={2}
            />
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} disabled={loading}>
            Annuler
          </Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Création...' : 'Créer'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default AddCardModal;
