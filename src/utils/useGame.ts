import { collection } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useCallback } from 'react';
import { useLocation } from 'react-router';
import { db, functions } from '../firebase';
import { ls } from './localStorage';
import { useGetEntity, useMutate, useUpdate } from './useEntity';

export const LS_PLAYER_ID_START = 'playerId_for_game_';

export const DEFAULT_SCORE_FOR_VICTORY = 15;

export const MIN_PLAYERS = 2;
export const MAX_PLAYERS = 4;

export enum Step {
  LOBBY = 'LOBBY',
  PLAYING_CARDS = 'PLAYING_CARDS',
  MAY_PLAY_AN_ADDITIONAL_UNIT = 'MAY_PLAY_AN_ADDITIONAL_UNIT',
  BEFORE_CONQUEST = 'BEFORE_CONQUEST',
  AFTER_CONQUEST = 'AFTER_CONQUEST',
  END_OF_GAME = 'END_OF_GAME',
}

export interface Game {
  id: string;
  createdAt: Date;
  creatorId: string;
  drawPile: string[];
  discardPile: string[];
  turnCounter: number;
  turnOfPlayer: string | null;
  step: Step;
  scoreForVictory: number;
  lastActionAt: Date;
  lastCallForActiondAt: Date;
}

export const gamesCollection = collection(db, 'games');

export const useGetGame = () => {
  const location = useLocation();
  const [, gameId] = location.pathname.split('/game/');

  const { data, loading, error } = useGetEntity<Game>(gamesCollection, gameId);

  return { gameId, game: data, loading, error };
};

export const useCreateGame = () => {
  const { mutate, loading } = useMutate();

  const createGame = useCallback(
    (playerName: string) => {
      const scoreForVictory = ls.get<number>('SCORE_FOR_VICTORY');

      return mutate(
        (async () => {
          const res = await httpsCallable<
            { playerName: string; scoreForVictory: number },
            { gameId: string; playerId: string }
          >(
            functions,
            'creategame',
          )({
            playerName,
            scoreForVictory: scoreForVictory || DEFAULT_SCORE_FOR_VICTORY,
          });

          return res.data;
        })(),
      );
    },
    [mutate],
  );

  return { createGame, loading };
};

export const useUpdateGame = () => {
  const { update, loading } = useUpdate();

  const updateGame = useCallback(
    (gameId: string, fields: Partial<Game>) =>
      update(gamesCollection, gameId, fields),
    [update],
  );

  return { updateGame, loading };
};
