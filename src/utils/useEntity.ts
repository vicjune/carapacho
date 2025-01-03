import {
  CollectionReference,
  deleteDoc,
  doc,
  DocumentData,
  FirestoreError,
  onSnapshot,
  Query,
  QueryDocumentSnapshot,
  updateDoc,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';
import { timestampConverter } from '../firebase';

export const useGetEntity = <T>(
  collection: CollectionReference<DocumentData>,
  id: string | undefined,
) => {
  const [data, setData] = useState<T>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError>();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setData(undefined);
      return;
    }

    setLoading(true);
    setError(undefined);

    const unsub = onSnapshot(
      doc(collection, id).withConverter<T, DocumentData>(timestampConverter),
      (docu) => {
        const docData = docu.data();
        setData(docData);
        setError(undefined);
        setLoading(false);
      },
      (e) => {
        setLoading(false);
        setError(e);
      },
    );

    return () => unsub();
  }, [collection, id]);

  return { data, loading, error };
};

// Warning: only put in the prop "query" something which is inside a useMemo
export const useGetList = <T>(
  query: Query<DocumentData> | undefined,
  skip?: boolean,
) => {
  const [data, setData] = useState<T[]>();
  const [snaps, seSnaps] = useState<QueryDocumentSnapshot<T>[]>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<FirestoreError>();

  useEffect(() => {
    if (skip || !query) {
      setLoading(false);
      setData(undefined);
      seSnaps(undefined);
      return;
    }

    setLoading(true);

    const unsub = onSnapshot(
      query.withConverter<T, DocumentData>(timestampConverter),
      (snapshots) => {
        let list: T[] = [];
        let snapList: QueryDocumentSnapshot<T>[] = [];
        snapshots.forEach((snapshot) => {
          list = [...list, snapshot.data()];
          snapList = [...snapList, snapshot];
        });

        setData(list);
        seSnaps(snapList);
        setLoading(false);
        setError(undefined);
      },
      (e) => {
        setLoading(false);
        setError(e);
      },
    );

    return () => unsub();
  }, [query, skip]);

  return { data, loading, error, snapshots: snaps };
};

export const useMutate = () => {
  const [loading, setLoading] = useState(false);

  const mutate = useCallback(async <T>(promise: Promise<T>) => {
    setLoading(true);
    try {
      return await promise;
    } finally {
      setLoading(false);
    }
  }, []);

  return { mutate, loading };
};

export const useUpdate = () => {
  const { mutate, loading } = useMutate();

  const update = useCallback(
    <T>(
      collection: CollectionReference<DocumentData>,
      id: string,
      fields: Partial<Omit<T, 'id'>>,
    ) =>
      mutate(
        updateDoc(doc(collection, id), timestampConverter.toFirestore(fields)),
      ),
    [mutate],
  );

  return { update, loading };
};

export const useDelete = () => {
  const { mutate, loading } = useMutate();

  const deleteEntity = useCallback(
    (collection: CollectionReference<DocumentData>, id: string) =>
      mutate(deleteDoc(doc(collection, id))),
    [mutate],
  );

  return { deleteEntity, loading };
};
