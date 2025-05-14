import { useEffect, useState } from 'react';
import { getVictims, addDeathDetails } from '../services/api';
import { 
  Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, Paper, Chip, Button,
  IconButton, Tooltip,CircularProgress 
} from '@mui/material';
import { red, green } from '@mui/material/colors';
import { type Victim } from '../types/victim';
import DeathDetailsModal from './DeathDetailsModal';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const VictimList = () => {
  const [victims, setVictims] = useState<Victim[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedVictim, setSelectedVictim] = useState<Victim | null>(null);

  // Fetch victims data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getVictims();
        setVictims(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleOpenModal = (victim: Victim) => {
    setSelectedVictim(victim);
    setModalOpen(true);
  };

  const handleSaveDetails = async (details: { cause: string; specifics: string }) => {
    if (!selectedVictim) return;
    
    try {
      // Update in backend
      await addDeathDetails(selectedVictim.id, details);
      
      // Update local state
      setVictims(victims.map(v => 
        v.id === selectedVictim.id 
          ? { 
              ...v, 
              cause: details.cause, 
              details: details.specifics, 
              is_dead: true,
              death_time: new Date().toISOString() 
            } 
          : v
      ));
      
      setModalOpen(false);
    } catch (error) {
      console.error("Error saving death details:", error);
    }
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
    <CircularProgress />
  </div>;

  return (
    <>
      <TableContainer component={Paper} sx={{ mt: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Causa</TableCell>
              <TableCell align="center">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {victims.map((victim) => (
              <TableRow key={victim.id} hover>
                <TableCell>{victim.full_name}</TableCell>
                <TableCell>
                  <Chip 
                    label={victim.is_dead ? '☠️ Muerto' : '❤️ Vivo'} 
                    sx={{ 
                      backgroundColor: victim.is_dead ? red[100] : green[100],
                      minWidth: 100,
                      fontWeight: 'bold'
                    }} 
                  />
                </TableCell>
                <TableCell>{victim.cause || 'Pendiente'}</TableCell>
                <TableCell align="center">
                  {!victim.is_dead && (
                    <Tooltip title="Agregar detalles de muerte" arrow>
                      <Button
                        variant="contained"
                        color="primary"
                        size="small"
                        startIcon={<AddCircleOutlineIcon />}
                        onClick={() => handleOpenModal(victim)}
                        sx={{
                          textTransform: 'none',
                          borderRadius: '20px',
                          boxShadow: 'none'
                        }}
                      >
                        Detalles
                      </Button>
                    </Tooltip>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Modal para detalles de muerte */}
      {selectedVictim && (
        <DeathDetailsModal
          open={modalOpen}
          victimId={selectedVictim.id}
          onClose={() => setModalOpen(false)}
          onSave={handleSaveDetails}
        />
      )}
    </>
  );
};

export default VictimList;