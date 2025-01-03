import { CircularProgress, Typography } from '@mui/material';
import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { AppBar } from '../../components/AppBar';
import { ls } from '../../utils/localStorage';
import { LS_PLAYER_ID_START, Step, useGetGame } from '../../utils/useGame';
import { useGlobalPlayerId } from '../../utils/usePlayer';
import { GameBoard } from './GameBoard';
import { Lobby } from './Lobby';

export const GamePage: FC = () => {
  const { t } = useTranslation();
  const { game, gameId, loading, error } = useGetGame();
  const [, setPlayerId] = useGlobalPlayerId();

  useEffect(() => {
    const LSPlayerId = ls.get<string>(`${LS_PLAYER_ID_START}${gameId}`);
    setPlayerId(LSPlayerId);
  }, [gameId, setPlayerId]);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">{error.message}</Typography>;
  }

  if (!game) {
    return <Typography>{t('THIS_GAME_DOESNT_EXIST')}</Typography>;
  }

  return (
    <>
      <AppBar />
      {game.step === Step.LOBBY ? <Lobby /> : <GameBoard />}
    </>
  );
};
