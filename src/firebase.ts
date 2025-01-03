import { isSameSecond, isValid } from 'date-fns';
import { initializeApp } from 'firebase/app';
import {
  FirestoreDataConverter,
  connectFirestoreEmulator,
  getFirestore,
  serverTimestamp,
} from 'firebase/firestore';
import { connectFunctionsEmulator, getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: 'AIzaSyCvUTrOQtUPea5HHMqmMS-OQDCvxZ9O-xA',
  authDomain: 'carapacho-91088.firebaseapp.com',
  projectId: 'carapacho-91088',
  storageBucket: 'carapacho-91088.firebasestorage.app',
  messagingSenderId: '626258890832',
  appId: '1:626258890832:web:47292fc0ba2208daa00155',
  measurementId: 'G-GW060BHS2T',
};

const convertTimestampsToDates = (object: Record<string, any>) => {
  let copy = { ...object };
  Object.entries(copy).forEach(([key, value]) => {
    if (value?.toDate) {
      copy = { ...copy, [key]: value.toDate() };
      return;
    }

    if (key === 'createdAt' && value === null) {
      copy = { ...copy, [key]: new Date() };
      return;
    }

    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null &&
      !(value instanceof Date)
    ) {
      copy = { ...copy, [key]: convertTimestampsToDates(value) };
    }
  });
  return copy;
};

const convertNowToTimestamp = (object: Record<string, any>) => {
  let copy = { ...object };
  Object.entries(copy).forEach(([key, value]) => {
    if (isValid(value) && isSameSecond(value, new Date())) {
      copy = { ...copy, [key]: serverTimestamp() };
      return;
    }

    if (
      typeof value === 'object' &&
      !Array.isArray(value) &&
      value !== null &&
      !(value instanceof Date)
    ) {
      copy = { ...copy, [key]: convertNowToTimestamp(value) };
    }
  });
  return copy;
};

export const timestampConverter: FirestoreDataConverter<any> = {
  toFirestore: (doc) => convertNowToTimestamp(doc),
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return { id: snapshot.id, ...convertTimestampsToDates(data) };
  },
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const functions = getFunctions(app, 'europe-west1');

if (import.meta.env.VITE_FB_EMULATORS) {
  connectFirestoreEmulator(db, 'localhost', 8080);
  connectFunctionsEmulator(functions, 'localhost', 5001);
}
