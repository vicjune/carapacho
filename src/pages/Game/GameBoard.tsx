import { Box, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useGetGame } from '../../utils/useGame';
import { useGetPlayers } from '../../utils/usePlayer';

export const GameBoard: FC = () => {
  const { t } = useTranslation();
  const { game } = useGetGame();
  const { players } = useGetPlayers();

  if (!game) return null;

  return (
    <>
      <Box>
        <Typography>{t('GAME')}</Typography>
        <Typography>{JSON.stringify(game)}</Typography>
      </Box>
    </>
  );
};
