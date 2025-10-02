/**
 * Utility functions for localStorage operations with error handling
 */

export class StorageError extends Error {
  constructor(message: string, public operation: string) {
    super(message);
    this.name = "StorageError";
  }
}

export const storage = {
  /**
   * Get item from localStorage with type safety
   */
  get<T>(key: string, defaultValue?: T): T | null {
    try {
      const item = localStorage.getItem(key);
      if (item === null) {
        return defaultValue ?? null;
      }
      return JSON.parse(item) as T;
    } catch (error) {
      console.error(`Error reading from localStorage for key "${key}":`, error);
      return defaultValue ?? null;
    }
  },

  /**
   * Set item in localStorage with error handling
   */
  set<T>(key: string, value: T): boolean {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to localStorage for key "${key}":`, error);
      throw new StorageError(`Failed to save data for key "${key}"`, "set");
    }
  },

  /**
   * Remove item from localStorage
   */
  remove(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(
        `Error removing from localStorage for key "${key}":`,
        error
      );
      return false;
    }
  },

  /**
   * Clear all localStorage data
   */
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      console.error("Error clearing localStorage:", error);
      return false;
    }
  },

  /**
   * Check if localStorage is available
   */
  isAvailable(): boolean {
    try {
      const testKey = "__storage_test__";
      localStorage.setItem(testKey, "test");
      localStorage.removeItem(testKey);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Get storage usage information
   */
  getUsage(): { used: number; available: number } {
    let used = 0;
    try {
      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          used += localStorage[key].length + key.length;
        }
      }
    } catch (error) {
      console.error("Error calculating storage usage:", error);
    }

    const available = 5 * 1024 * 1024 - used;
    return { used, available };
  },
};
