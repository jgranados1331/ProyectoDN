import { useState } from 'react';
import { addVictim } from '../services/api';
import { Button, TextField, Box, Alert } from '@mui/material';
import { type Victim } from '../types/victim';

const VictimForm = () => {
  const [formData, setFormData] = useState<Omit<Victim, 'id'>>({
    full_name: '',
    image_url: '',
    is_dead: false
  });
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addVictim(formData);
      alert('¡Víctima registrada con éxito!');
      setFormData({ full_name: '', image_url: '', is_dead: false });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
      {error && <Alert severity="error">{error}</Alert>}
      
      <TextField
        label="Nombre completo"
        value={formData.full_name}
        onChange={(e) => setFormData({...formData, full_name: e.target.value})}
        fullWidth
        margin="normal"
        required
      />
      
      <TextField
        label="URL de la imagen"
        value={formData.image_url}
        onChange={(e) => setFormData({...formData, image_url: e.target.value})}
        fullWidth
        margin="normal"
        required
      />
      
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 2 }}>
        Registrar
      </Button>
    </Box>
  );
};

export default VictimForm;