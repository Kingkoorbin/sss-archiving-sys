import { useState, useEffect } from 'react';

type LocalStorageHookResult<T> = [T | null, (value: T) => void, () => void];

export function useLocalStorage<T>(key: string): LocalStorageHookResult<T> {
  const [value, setValue] = useState<T | null>(() => {
    const storedValue = localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : null;
  });

  const removeValue = () => {
    localStorage.removeItem(key);
    setValue(null);
  };

  useEffect(() => {
    if (value === null) {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }, [key, value]);

  return [value, setValue, removeValue];
}
