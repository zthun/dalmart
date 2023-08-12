import { IZDatabaseMemory } from '@zthun/dalmart-db';

/**
 * Represents an implements of an IZMemoryDatabase that references session and local storage.
 */
export class ZDatabaseStorage implements IZDatabaseMemory {
  /**
   * Initializes a new instance of this object.
   *
   * @param _storage -
   *        The storage mechanism to use to read from.
   */
  public constructor(private _storage: Storage) {}

  public async read<T>(key: string, fallback?: T): Promise<T | null> {
    const data = this._storage.getItem(key);

    if (data == null && fallback != null) {
      const serialized = JSON.stringify(fallback);
      this._storage.setItem(key, serialized);
      return Promise.resolve(fallback);
    }

    if (data == null) {
      return Promise.resolve(null);
    }

    const deserialized = JSON.parse(data) as T;
    return Promise.resolve(deserialized);
  }

  public async upsert<T>(key: string, value: T) {
    const serialized = JSON.stringify(value);
    this._storage.setItem(key, serialized);
    return Promise.resolve(value);
  }

  public async delete(key?: string) {
    if (key == null) {
      this._storage.clear();
    } else {
      this._storage.removeItem(key);
    }

    return Promise.resolve();
  }
}
