import { Box, FormControl, MenuItem, Select } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { Card } from '../components/Card';
import { cards } from '../utils/cards';

export function Home() {
  const { i18n } = useTranslation();

  const languages = Object.keys(i18n.options.resources || {});

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column' }}>
      <FormControl
        sx={{
          p: 2,
          alignSelf: 'flex-end',
          '@media print': {
            display: 'none',
          },
        }}
      >
        <Select
          size="small"
          value={i18n.resolvedLanguage}
          onChange={({ target }) => {
            i18n.changeLanguage(target.value);
          }}
        >
          {languages.map((language) => (
            <MenuItem key={language} value={language}>
              {language.toUpperCase()}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
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
    </Box>
  );
}
