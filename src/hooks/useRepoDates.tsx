import { useState, useEffect } from 'react';

type LocalStorageValue<T> = [T, (value: T) => void];

function useRepoLocalStorage<T>(key: string, initialValue: T): LocalStorageValue<T> {
  const [value, setValue] = useState<T>(() => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
export default useRepoLocalStorage;


