import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  Alert,
  CircularProgress,
  Typography
} from '@mui/material';

const DeathDetailsModal = ({
  open,
  victimId,
  onClose,
  onSave
}: {
  open: boolean;
  victimId: number;
  onClose: () => void;
  onSave: (details: { cause: string; specifics: string }) => Promise<void>;
}) => {
  const [cause, setCause] = useState('');
  const [specifics, setSpecifics] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40); // 40 segundos iniciales

  // Resetear estado cuando se abre
  useEffect(() => {
    if (open) {
      setCause('');
      setSpecifics('');
      setTimeLeft(40);
      setError('');
    }
  }, [open]);

  // Temporizador
  useEffect(() => {
    if (!open) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [open]);

  const handleSubmit = async () => {
    if (!cause && timeLeft > 0) {
      setError('Debes especificar una causa de muerte');
      return;
    }

    setLoading(true);
    try {
      await onSave({ 
        cause: timeLeft > 0 ? cause : "Ataque al corazón",
        specifics: timeLeft > 0 ? specifics : ""
      });
      onClose();
    } catch (err) {
      setError('Error al guardar los detalles');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" component="div">
          Registrar Muerte - Víctima #{victimId}
        </Typography>
        <Typography 
          variant="body2" 
          color={timeLeft > 10 ? "text.secondary" : "error"}
          sx={{ mt: 1 }}
        >
          {timeLeft > 0 ? (
            `Tiempo restante: ${timeLeft}s`
          ) : (
            "Tiempo agotado - Causa automática: Ataque al corazón"
          )}
        </Typography>
      </DialogTitle>
      
      <DialogContent dividers>
        <Stack spacing={3} sx={{ mt: 1 }}>
          {timeLeft > 0 ? (
            <>
              <TextField
                label="Causa de muerte *"
                value={cause}
                onChange={(e) => setCause(e.target.value)}
                fullWidth
                disabled={loading}
                helperText="Tienes 40 segundos para especificar la causa"
              />

              <TextField
                label="Detalles específicos"
                value={specifics}
                onChange={(e) => setSpecifics(e.target.value)}
                multiline
                rows={4}
                fullWidth
                disabled={loading}
                helperText="Opcional - Tienes 6 minutos y 40 segundos para agregar detalles"
              />
            </>
          ) : (
            <Alert severity="warning" sx={{ mb: 2 }}>
              El tiempo para especificar la causa ha expirado. La víctima morirá de un ataque al corazón.
            </Alert>
          )}

          {error && <Alert severity="error">{error}</Alert>}
        </Stack>
      </DialogContent>
      
      <DialogActions>
        <Button 
          onClick={onClose} 
          disabled={loading}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          color={timeLeft <= 0 ? "secondary" : "primary"}
        >
          {timeLeft <= 0 ? "Confirmar Muerte Automática" : "Guardar Detalles"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeathDetailsModal;