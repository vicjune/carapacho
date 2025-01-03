import { AddBox, IndeterminateCheckBox } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ls } from '../utils/localStorage';
import { Game, useUpdateGame } from '../utils/useGame';
import { useNotification } from '../utils/useNotification';

export const EditGameDialog: FC<{
  open: boolean;
  onClose?: () => void;
  game: Game;
}> = ({ open, onClose, game }) => {
  const { t } = useTranslation();
  const { pushError } = useNotification();
  const { updateGame, loading } = useUpdateGame();
  const [gameEdit, setGameEdit] = useState(game);

  const onUpdateGame = async () => {
    try {
      const { scoreForVictory } = gameEdit;
      await updateGame(game.id, { scoreForVictory });
      ls.set('GAME_OPTIONS', { scoreForVictory });
    } catch (e) {
      pushError(e);
    }
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('GAME_OPTIONS')}</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <IconButton
            disabled={gameEdit.scoreForVictory <= 1}
            onClick={() =>
              setGameEdit((prev) => ({
                ...prev,
                scoreForVictory: prev.scoreForVictory - 1,
              }))
            }
          >
            <IndeterminateCheckBox />
          </IconButton>
          {gameEdit.scoreForVictory}
          <IconButton
            onClick={() =>
              setGameEdit((prev) => ({
                ...prev,
                scoreForVictory: prev.scoreForVictory + 1,
              }))
            }
          >
            <AddBox />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.()}>{t('CANCEL')}</Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={() => onUpdateGame()}
        >
          {t('VALIDATE')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
