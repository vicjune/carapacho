import { LoadingButton } from '@mui/lab';
import { Box, Button } from '@mui/material';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { generatePath, useNavigate } from 'react-router';
import { AppBar } from '../components/AppBar';
import { PlayerNameDialog } from '../components/PlayerNameDialog';
import { Path } from '../types/Path';
import { ls } from '../utils/localStorage';
import { useDialog } from '../utils/useDialog';
import { LS_PLAYER_ID_START, useCreateGame } from '../utils/useGame';
import { useNotification } from '../utils/useNotification';

export const HomePage: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { createGame, loading } = useCreateGame();
  const { pushError } = useNotification();

  const [openDialog, closeDialog] = useDialog((open) => (
    <PlayerNameDialog
      open={open}
      onClose={closeDialog}
      onValidate={(name) => onCreateGame(name)}
    />
  ));

  useEffect(() => {
    // TODO Periodically clean local storage of deleted games
  }, []);

  const onCreateGame = async (playerName?: string) => {
    let name = playerName || null;

    if (!name) {
      name = ls.get<string>('PLAYER_NAME');
    }

    if (!name) {
      openDialog();
      return;
    }

    try {
      const { gameId, playerId } = await createGame(name);
      ls.set(`${LS_PLAYER_ID_START}${gameId}`, playerId);
      navigate(generatePath(Path.GAME, { gameId }));
    } catch (e) {
      pushError(e);
    }
  };

  return (
    <>
      <AppBar
        sx={{
          '@media print': {
            display: 'none',
          },
        }}
      />
      <Box>
        <LoadingButton onClick={() => onCreateGame()} loading={loading}>
          {t('NEW_GAME')}
        </LoadingButton>
        <Button href={Path.PRINT}>{t('PRINT_CARDS')}</Button>
      </Box>
    </>
  );
};
