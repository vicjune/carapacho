import { Box } from '@mui/material';
import { Card } from '../components/Card';
import { cards } from '../utils/cards';

export function Home() {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        p: 2,
        '@media print': {
          p: 0,
        },
      }}
    >
      {cards.map((card) => (
        <Card card={card} key={card.id} sx={{ m: 2 }} scale={0.6666666667} />
      ))}
    </Box>
  );
}