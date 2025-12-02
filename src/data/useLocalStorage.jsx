import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue) {
  // 1. Initialize state with a function to get the stored value
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      // Parse stored json or return initialValue
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      // If error, return initialValue
      console.log(error);
      return initialValue;
    }
  });

  // 2. useEffect to update localStorage when the 'value' state changes
  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.log(error);
    }
  }, [key, value]); // Dependencies: Re-run effect when key or value changes

  return [value, setValue];
}

export default useLocalStorage;