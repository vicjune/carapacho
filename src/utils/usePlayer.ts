import { collection, query as fsQuery, orderBy } from 'firebase/firestore';
import { httpsCallable } from 'firebase/functions';
import { useCallback, useMemo } from 'react';
import { atom, useRecoilState } from 'recoil';
import { functions } from '../firebase';
import { useDelete, useGetList, useMutate, useUpdate } from './useEntity';
import { gamesCollection, useGetGame } from './useGame';

export const LS_PLAYER_NAME = 'playerName';

export interface Player {
  id: string;
  createdAt: Date;
  name: string;
  color: number;
  score: number;
  hand: string[];
  actionsAlreadyPlayed: number;
  actionsLeftToPlay: number;
  unitsLeftToPlay: number;
}

const PLAYERS_COLLECTION = 'players';
export const getPlayersCollection = (gameId: string) =>
  collection(gamesCollection, gameId, PLAYERS_COLLECTION);

const playerIdAtom = atom<string | null>({
  key: 'playerId',
  default: null,
});

export const useGlobalPlayerId = () => useRecoilState(playerIdAtom);

export const useGetPlayers = (skip?: boolean) => {
  const { gameId } = useGetGame();

  const query = useMemo(
    () =>
      gameId
        ? fsQuery(getPlayersCollection(gameId), orderBy('createdAt'))
        : undefined,
    [gameId],
  );
  const { data, loading, error } = useGetList<Player>(query, skip);

  return {
    players: data,
    loading,
    error,
  };
};

export const useCreatePlayer = () => {
  const { mutate, loading } = useMutate();

  const createPlayer = useCallback(
    (gameId: string, playerName: string) =>
      mutate(
        (async () => {
          const res = await httpsCallable<
            { playerName: string; gameId: string },
            string
          >(
            functions,
            'createplayer',
          )({ playerName, gameId });

          return res.data;
        })(),
      ),
    [mutate],
  );

  return { createPlayer, loading };
};

export const useUpdatePlayer = () => {
  const { update, loading } = useUpdate();

  const updatePlayer = useCallback(
    (gameId: string, playerId: string, fields: Partial<Player>) =>
      update(getPlayersCollection(gameId), playerId, fields),
    [update],
  );

  return { updatePlayer, loading };
};

export const useDeletePlayer = () => {
  const { loading } = useMutate();
  const { deleteEntity } = useDelete();

  const deletePlayer = useCallback(
    (gameId: string, playerId: string) =>
      deleteEntity(getPlayersCollection(gameId), playerId),
    [deleteEntity],
  );

  return { deletePlayer, loading };
};
