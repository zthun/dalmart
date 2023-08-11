/**
 * Represents a set of database operations for an in-memory database.
 *
 * These kinds of databases are key value pairs similar to redis,
 * local storage, sessions storage, and index-db storage.
 */
export interface IZMemoryDatabase {
  /**
   * Gets the value of a specific key in the database.
   *
   * @param key -
   *        The key to retrieve.
   *
   * @returns
   *        The value of the given key, null if no such value
   *        exists and no fallback was provided.
   */
  read<T>(key: string): Promise<T | null>;

  /**
   * Gets the value of a specific key in the database.
   *
   * @param key -
   *        The key to retrieve.
   * @param fallback -
   *        The fallback value.  If the key does not exist
   *        in the database, then this will be inserted
   *        automatically.
   *
   * @returns
   *        The value of the given key or the inserted fallback value
   *        if the key does not exist.
   */
  read<T>(key: string, fallback: T): Promise<T>;

  /**
   * Creates or updates a key value.
   *
   * @param key -
   *        The key to update.
   * @param value -
   *        The value to set.
   */
  upsert<T>(key: string, value: T): Promise<T>;

  /**
   * Deletes a key in the database or deletes all keys in the database.
   *
   * @param key -
   *        The key to delete.  If this is undefined, then all
   *        keys should be deleted.
   */
  delete(key?: string): Promise<void>;
}
