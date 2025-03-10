import { useEffect, useState } from "react";

// Hook to sync state with localStorage
export default function useLocalStorage<T>(key: string, initialState: T) {
  // Retrieve value from localStorage or fallback to initialState
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key);
    // If storedValue is found, parse it, otherwise return initialState
    return storedValue ? JSON.parse(storedValue) : initialState;
  });

  useEffect(() => {
    // Update localStorage whenever value changes
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const; // Returning value and setter function as a tuple
}
