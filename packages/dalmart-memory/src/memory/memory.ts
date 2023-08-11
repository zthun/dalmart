import { IZMemoryDatabase } from '@zthun/dalmart-db';

/**
 * Represents an implements of an IZMemoryDatabase that just stores key value pairs in memory.
 */
export class ZMemoryDatabase implements IZMemoryDatabase {
  private _database: any = {};

  public async read<T>(key: string, fallback?: T): Promise<T | null> {
    const data = this._database[key];

    if (data == null && fallback != null) {
      const serialized = JSON.stringify(fallback);
      this._database[key] = serialized;
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
    this._database[key] = serialized;
    return Promise.resolve(value);
  }

  public async delete(key?: string) {
    if (key == null) {
      this._database = {};
    } else {
      delete this._database[key];
    }

    return Promise.resolve();
  }
}
