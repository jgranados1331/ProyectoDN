import { Container, Typography } from '@mui/material';
import VictimForm from '../components/VictimForm';
import VictimList from '../components/VictimList';

const Home = () => {
  return (
    <Container maxWidth="md">
      <Typography variant="h3" component="h1" gutterBottom sx={{ mt: 4, fontWeight: 'bold' }}>
        Death Note App
      </Typography>
      <VictimForm />
      <VictimList />
    </Container>
  );
};

export default Home;