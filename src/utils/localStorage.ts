export const ls = {
  get: <Type>(reference: string) => {
    try {
      const localStorageValue = localStorage.getItem(reference);

      const parsedValue = localStorageValue
        ? JSON.parse(localStorageValue)
        : null;

      return parsedValue !== null && parsedValue !== undefined
        ? (parsedValue as Type)
        : null;
    } catch (e) {
      console.error(e);
    }

    return null;
  },

  set: (reference: string, payload: any) => {
    try {
      localStorage.setItem(reference, JSON.stringify(payload));
    } catch (e) {
      console.error(e);
    }
  },

  remove: (reference: string) => {
    try {
      localStorage.removeItem(reference);
    } catch (e) {
      console.error(e);
    }
  },

  clear: () => {
    try {
      localStorage.clear();
    } catch (e) {
      console.error(e);
    }
  },
};
