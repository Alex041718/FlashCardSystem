import { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, FormControlLabel, Checkbox, Button } from '@mui/material';
import './AddCollectionModal.scss';
import { createCollection } from '../services/collectionService';
import { showSuccess, showError } from '../utils/toast';

interface AddCollectionModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const AddCollectionModal = ({ open, onClose, onSuccess }: AddCollectionModalProps) => {
  const [name, setName] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);
  const [color, setColor] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string }>({});

  const handleClose = () => {
    if (!loading) {
      setName('');
      setIsFavorite(false);
      setColor('');
      setErrors({});
      onClose();
    }
  };

  const validate = () => {
    const newErrors: { name?: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Le nom est obligatoire';
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
      await createCollection({
        name: name.trim(),
        isFavorite,
        color: color.trim() || null,
      });
      showSuccess('Collection créée avec succès !');
      handleClose();
      onSuccess();
    } catch (error) {
      console.error('Error creating collection:', error);
      showError('Erreur lors de la création de la collection');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Nouvelle Collection</DialogTitle>
        <DialogContent>
          <div className="add-collection-modal__form">
            <TextField
              label="Nom"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={!!errors.name}
              helperText={errors.name}
              fullWidth
              required
              autoFocus
              disabled={loading}
            />

            <TextField
              label="Couleur (optionnel)"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="#6366f1"
              fullWidth
              disabled={loading}
            />

            <FormControlLabel
              control={
                <Checkbox
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  disabled={loading}
                />
              }
              label="Marquer comme favori"
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

export default AddCollectionModal;
