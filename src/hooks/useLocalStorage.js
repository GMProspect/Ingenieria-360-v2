import { useState, useEffect } from 'react';

function useLocalStorage(key, initialValue, userId = null) {
    // Create a user-specific key if userId is provided
    const storageKey = userId ? `${userId}_${key}` : key;

    // Get from local storage then
    // parse stored json or if none return initialValue
    const [storedValue, setStoredValue] = useState(() => {
        if (typeof window === 'undefined') {
            return initialValue;
        }
        try {
            const item = window.localStorage.getItem(storageKey);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.log(error);
            return initialValue;
        }
    });

    // Update storedValue when userId changes (user logs in/out)
    useEffect(() => {
        if (typeof window === 'undefined') return;

        try {
            const item = window.localStorage.getItem(storageKey);
            const newValue = item ? JSON.parse(item) : initialValue;
            setStoredValue(newValue);
        } catch (error) {
            console.log(error);
            setStoredValue(initialValue);
        }
    }, [storageKey]); // eslint-disable-line react-hooks/exhaustive-deps

    // Return a wrapped version of useState's setter function that ...
    // ... persists the new value to localStorage.
    const setValue = (value) => {
        try {
            // Allow value to be a function so we have same API as useState
            const valueToStore =
                value instanceof Function ? value(storedValue) : value;

            // Save state
            setStoredValue(valueToStore);

            // Save to local storage
            if (typeof window !== 'undefined') {
                window.localStorage.setItem(storageKey, JSON.stringify(valueToStore));
            }
        } catch (error) {
            console.log(error);
        }
    };

    return [storedValue, setValue];
}

export default useLocalStorage;
