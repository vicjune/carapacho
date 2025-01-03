import { Delete, Edit } from '@mui/icons-material';
import { LoadingButton } from '@mui/lab';
import { Box, Button, IconButton, Typography } from '@mui/material';
import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router';
import { EditGameDialog } from '../../components/EditGameDialog';
import { EditPlayerDialog } from '../../components/EditPlayer';
import { PlayerNameDialog } from '../../components/PlayerNameDialog';
import { Path } from '../../types/Path';
import { ls } from '../../utils/localStorage';
import { useDialog } from '../../utils/useDialog';
import {
  LS_PLAYER_ID_START,
  MAX_PLAYERS,
  MIN_PLAYERS,
  useGetGame,
} from '../../utils/useGame';
import { useNotification } from '../../utils/useNotification';
import {
  Player,
  useCreatePlayer,
  useDeletePlayer,
  useGetPlayers,
  useGlobalPlayerId,
} from '../../utils/usePlayer';

export const Lobby: FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { pushError } = useNotification();
  const { game } = useGetGame();
  const [playerId, setPlayerId] = useGlobalPlayerId();
  const { players, error } = useGetPlayers();
  const { createPlayer, loading: createLoading } = useCreatePlayer();
  const { deletePlayer, loading: deleteLoading } = useDeletePlayer();

  const [openPlayerNameDialog, closePlayerNameDialog] = useDialog((open) => (
    <PlayerNameDialog
      open={open}
      onClose={closePlayerNameDialog}
      onValidate={(name) => joinGame(name)}
    />
  ));

  const [openEditPlayerDialog, closeEditPlayerDialog] = useDialog<Player>(
    (open, player) =>
      player && game ? (
        <EditPlayerDialog
          open={open}
          onClose={closeEditPlayerDialog}
          gameId={game.id}
          player={player}
        />
      ) : null,
  );

  const [openEditGameDialog, closeEditGameDialog] = useDialog((open) =>
    game ? (
      <EditGameDialog open={open} onClose={closeEditGameDialog} game={game} />
    ) : null,
  );

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  if (!game || !players) return null;

  const joinGame = async (playerName?: string) => {
    let name = playerName || null;

    if (!name) {
      name = ls.get<string>('PLAYER_NAME');
    }

    if (!name) {
      openPlayerNameDialog();
      return;
    }

    try {
      const newPlayerId = await createPlayer(game.id, name);
      ls.set(`${LS_PLAYER_ID_START}${game.id}`, newPlayerId);
      setPlayerId(newPlayerId);
    } catch (e) {
      pushError(e);
    }
  };

  const leaveGame = async () => {
    if (!playerId) return;

    try {
      await deletePlayer(game.id, playerId);
      ls.remove(`${LS_PLAYER_ID_START}${game.id}`);
      setPlayerId(null);
      navigate(Path.HOME);
    } catch (e) {
      pushError(e);
    }
  };

  const removePlayer = async (id: string) => {
    try {
      await deletePlayer(game.id, id);
    } catch (e) {
      pushError(e);
    }
  };

  const notInTheGame = players && !players.find(({ id }) => id === playerId);
  const gameCreator = playerId === game.creatorId;

  return (
    <>
      {notInTheGame ? (
        <LoadingButton loading={createLoading} onClick={() => joinGame()}>
          {t('JOIN_GAME')}
        </LoadingButton>
      ) : (
        <LoadingButton loading={deleteLoading} onClick={() => leaveGame()}>
          {t('LEAVE_GAME')}
        </LoadingButton>
      )}
      {players && (
        <Box>
          <Typography>{t('PLAYERS')}</Typography>
          {players?.map((player) => (
            <Box key={player.id}>
              <Box>{player.name}</Box>
              {(gameCreator || player.id === playerId) && (
                <>
                  <IconButton onClick={() => openEditPlayerDialog(player)}>
                    <Edit />
                  </IconButton>
                </>
              )}
              {gameCreator && player.id !== game.creatorId && (
                <>
                  <IconButton onClick={() => removePlayer(player.id)}>
                    <Delete />
                  </IconButton>
                </>
              )}
            </Box>
          ))}
        </Box>
      )}
      {gameCreator && (
        <Button onClick={() => openEditGameDialog()}>
          {t('GAME_OPTIONS')}
        </Button>
      )}
      {gameCreator && (
        <LoadingButton
          disabled={
            players.length < MIN_PLAYERS || players?.length > MAX_PLAYERS
          }
        >
          {t('LAUNCH_GAME')}
        </LoadingButton>
      )}
    </>
  );
};
