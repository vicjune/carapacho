import { initializeApp } from 'firebase-admin/app';
import {
  FieldValue,
  getFirestore,
  QueryDocumentSnapshot,
} from 'firebase-admin/firestore';
import { setGlobalOptions } from 'firebase-functions/options';
import { onDocumentDeleted } from 'firebase-functions/v2/firestore';
import { HttpsError, onCall } from 'firebase-functions/v2/https';
import { getGamesCollection, getPlayersCollection } from './collections';
import { Player, Step } from './types';
import { isString } from './utils';

const GUEST_COLORS_LENGTH = 17;

initializeApp();
setGlobalOptions({ region: 'europe-west1' });
const firestore = getFirestore();
firestore.settings({ ignoreUndefinedProperties: true });

exports.creategame = onCall<
  { playerName: string; scoreForVictory: number } | undefined | null,
  Promise<{ gameId: string; playerId: string }>
>(async (request) => {
  const playerName = request.data?.playerName;
  const scoreForVictory = request.data?.scoreForVictory;

  if (
    !isString(playerName) ||
    !scoreForVictory ||
    isNaN(scoreForVictory) ||
    scoreForVictory < 1
  ) {
    throw new HttpsError('permission-denied', 'Data is invalid');
  }

  const ref = await getGamesCollection({ firestore }).add({
    createdAt: FieldValue.serverTimestamp(),
    creatorId: null,
    drawPile: [],
    discardPile: [],
    lastActionAt: FieldValue.serverTimestamp(),
    lastCallForActiondAt: FieldValue.serverTimestamp(),
    scoreForVictory,
    step: Step.LOBBY,
    turnCounter: 0,
    turnOfPlayer: null,
  });

  const playerRef = await getPlayersCollection({
    firestore,
    gameId: ref.id,
  }).add({
    name: playerName,
    createdAt: FieldValue.serverTimestamp(),
    color: Math.floor(Math.random() * GUEST_COLORS_LENGTH),
    hand: [],
    score: 0,
    actionsAlreadyPlayed: 0,
    actionsLeftToPlay: 0,
    unitsLeftToPlay: 0,
  });

  await ref.update({
    creatorId: playerRef.id,
  });

  return { gameId: ref.id, playerId: playerRef.id };
});

exports.createplayer = onCall<
  { playerName: string; gameId: string } | undefined | null,
  Promise<string>
>(async (request) => {
  const playerName = request.data?.playerName;
  const gameId = request.data?.gameId;

  if (!isString(playerName) || !isString(gameId)) {
    throw new HttpsError('permission-denied', 'Data is invalid');
  }

  const gameSnap = await getGamesCollection({ firestore }).doc(gameId).get();
  const game = gameSnap.data();
  if (game?.step !== Step.LOBBY) {
    throw new HttpsError('permission-denied', 'Game has already started');
  }

  const ref = await getPlayersCollection({
    firestore,
    gameId,
  }).add({
    name: playerName,
    createdAt: FieldValue.serverTimestamp(),
    color: Math.floor(Math.random() * GUEST_COLORS_LENGTH),
    hand: [],
    score: 0,
    actionsAlreadyPlayed: 0,
    actionsLeftToPlay: 0,
    unitsLeftToPlay: 0,
  });

  return ref.id;
});

exports.onplayerdeleted = onDocumentDeleted(
  'games/{gameId}/players/{playerId}',
  async ({ data: untypedData }) => {
    if (!untypedData) return;
    const data = untypedData as QueryDocumentSnapshot<Player>;

    const gameRef = data.ref.parent.parent;
    if (!gameRef) return;

    const playersSnap = await getPlayersCollection({
      firestore,
      gameId: gameRef?.id,
    })
      .orderBy('createdAt')
      .get();

    if (playersSnap.size) {
      await gameRef.update({
        creatorId:
          playersSnap.docs.filter(({ id }) => id !== data.id)[0]?.id || null,
      });
    } else {
      await firestore.recursiveDelete(gameRef);
    }
  },
);
