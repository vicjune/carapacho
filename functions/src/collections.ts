import { CollectionReference, Firestore } from 'firebase-admin/firestore';
import { Card, Game, Place, Player } from './types';

export const getGamesCollection = ({ firestore }: { firestore: Firestore }) =>
  firestore.collection('games') as CollectionReference<Game>;

export const getPlayersCollection = ({
  firestore,
  gameId,
}: {
  firestore: Firestore;
  gameId: string;
}) =>
  getGamesCollection({ firestore })
    .doc(gameId)
    .collection('players') as CollectionReference<Player>;

export const getPlacesCollection = ({
  firestore,
  gameId,
}: {
  firestore: Firestore;
  gameId: string;
}) =>
  getGamesCollection({ firestore })
    .doc(gameId)
    .collection('places') as CollectionReference<Place>;

export const getCardsCollection = ({
  firestore,
  gameId,
}: {
  firestore: Firestore;
  gameId: string;
}) =>
  getGamesCollection({ firestore })
    .doc(gameId)
    .collection('cards') as CollectionReference<Card>;
