import { LoadingButton } from '@mui/lab';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ls } from '../utils/localStorage';
import { useNotification } from '../utils/useNotification';
import { Player, useGlobalPlayerId, useUpdatePlayer } from '../utils/usePlayer';

export const EditPlayerDialog: FC<{
  open: boolean;
  onClose?: () => void;
  gameId: string;
  player: Player;
}> = ({ open, onClose, gameId, player }) => {
  const { t } = useTranslation();
  const { pushError } = useNotification();
  const { updatePlayer, loading } = useUpdatePlayer();
  const [playerId] = useGlobalPlayerId();
  const [playerEdit, setPlayerEdit] = useState(player);

  const onUpdatePlayer = async () => {
    try {
      const { name, color } = playerEdit;
      await updatePlayer(gameId, player.id, { name, color });
      if (playerId === player.id) {
        ls.set('PLAYER_NAME', name);
      }
    } catch (e) {
      pushError(e);
    }
    onClose?.();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('EDIT_PLAYER')}</DialogTitle>
      <DialogContent>
        <TextField
          value={playerEdit.name}
          onChange={({ target }) =>
            setPlayerEdit((prev) => ({ ...prev, name: target.value }))
          }
        />
        <TextField
          type="number"
          value={playerEdit.color}
          onChange={({ target }) =>
            setPlayerEdit((prev) => ({ ...prev, color: Number(target.value) }))
          }
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.()}>{t('CANCEL')}</Button>
        <LoadingButton
          loading={loading}
          variant="contained"
          onClick={() => onUpdatePlayer()}
        >
          {t('VALIDATE')}
        </LoadingButton>
      </DialogActions>
    </Dialog>
  );
};
