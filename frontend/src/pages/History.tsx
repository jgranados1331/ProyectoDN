import { useState, useEffect } from 'react';
import { getVictims } from '../services/api';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, CircularProgress, Typography 
} from '@mui/material';
import type { Victim } from '../types/victim';

const VictimList = () => {
  const [victims, setVictims] = useState<Victim[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVictims();
        setVictims(data);
      } catch (err) {
        setError('Error al cargar víctimas');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return <Typography color="error">{error}</Typography>;
  }

  if (!victims || victims.length === 0) {
    return <Typography>No hay víctimas registradas</Typography>;
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Nombre</TableCell>
            <TableCell>Estado</TableCell>
            <TableCell>Causa</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {victims.map((victim) => (
            <TableRow key={victim.id}>
              <TableCell>{victim.full_name}</TableCell>
              <TableCell>
                {victim.is_dead ? '☠️ Muerto' : '❤️ Vivo'}
              </TableCell>
              <TableCell>
                {victim.cause || 'Ataque al corazón'}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default VictimList;