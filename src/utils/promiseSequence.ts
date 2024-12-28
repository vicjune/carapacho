export const promiseSequence = async <T>(
  initialValue: T,
  promises: ((t: T) => Promise<T>)[],
) =>
  promises.reduce<Promise<T>>(
    (prev, promise) => prev.then((t) => promise(t)),
    Promise.resolve(initialValue),
  );
