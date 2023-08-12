import { IZDatabaseMemory, IZDatabaseOptions } from '@zthun/dalmart-db';
import localforage from 'localforage';

/**
 * Represents an implements of an IZMemoryDatabase that references session and local storage.
 */
export class ZDatabaseForage implements IZDatabaseMemory {
  /**
   * Initializes a new instance of this object.
   *
   * @param options -
   *        The database options to configure forage indexes.
   */
  public constructor(options: IZDatabaseOptions) {
    localforage.config({
      name: options.database
    });
  }

  public async read<T>(key: string, fallback?: T): Promise<T | null> {
    const data = await localforage.getItem<T>(key);

    if (data == null && fallback != null) {
      await localforage.setItem(key, fallback);
      return Promise.resolve(fallback);
    }

    if (data == null) {
      return Promise.resolve(null);
    }

    return data;
  }

  public async upsert<T>(key: string, value: T) {
    localforage.setItem(key, value);
    return Promise.resolve(value);
  }

  public async delete(key?: string) {
    if (key == null) {
      localforage.clear();
    } else {
      localforage.removeItem(key);
    }

    return Promise.resolve();
  }
}
