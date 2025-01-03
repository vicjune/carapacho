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

export const PlayerNameDialog: FC<{
  open: boolean;
  onClose?: () => void;
  onValidate?: (playerName: string) => void;
}> = ({ open, onClose, onValidate }) => {
  const { t } = useTranslation();
  const [name, setName] = useState('');

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>{t('CHOOSE_NAME')}</DialogTitle>
      <DialogContent>
        <TextField
          value={name}
          onChange={({ target }) => setName(target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose?.()}>{t('CANCEL')}</Button>
        <Button
          variant="contained"
          disabled={!name}
          onClick={() => {
            ls.set('PLAYER_NAME', name);
            onValidate?.(name);
            onClose?.();
          }}
        >
          {t('VALIDATE')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
