/**
 * Persist a value to localStorage under the given key.
 * Objects / arrays are JSON-serialised automatically.
 */
export function saveToLocalStorage(key: string, data: any): void {
  try {
    const serialised = JSON.stringify(data);
    localStorage.setItem(key, serialised);
  } catch (error) {
    console.error(`Error saving to localStorage [${key}]:`, error);
  }
}

/**
 * Read a value from localStorage.
 * Returns `null` when the key does not exist or the stored value
 * cannot be parsed.
 */
export function getFromLocalStorage<T>(key: string): T | null {
  try {
    const serialised = localStorage.getItem(key);
    if (serialised === null) return null;
    return JSON.parse(serialised) as T;
  } catch (error) {
    console.error(`Error reading from localStorage [${key}]:`, error);
    return null;
  }
}

/**
 * Remove a single entry from localStorage.
 */
export function removeFromLocalStorage(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage [${key}]:`, error);
  }
}
