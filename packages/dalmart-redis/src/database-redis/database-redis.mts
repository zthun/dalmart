import { IZDatabaseMemory, IZDatabaseOptions } from '@zthun/dalmart-db';
import { RedisClientType, createClient } from 'redis';

/**
 * Represents a connection to a redis database.
 */
export class ZDatabaseRedis implements IZDatabaseMemory {
  private _client: RedisClientType;

  /**
   * Initializes a new instance of this object.
   *
   * @param options -
   *        The connection options for this database.
   */
  public constructor(options: IZDatabaseOptions) {
    this._client = createClient({
      url: options.url
    });
  }

  public read<T>(key: string, fallback?: T): Promise<T | null> {
    return this._do(async () => {
      let data = await this._client.get(key);

      if (data == null && fallback != null) {
        const fb = JSON.stringify(fallback);
        await this._client.set(key, fb);
        data = fb;
      }

      if (data == null) {
        return null;
      }

      return JSON.parse(data) as T;
    });
  }

  public upsert<T>(key: string, value: T): Promise<T> {
    return this._do(async () => {
      const v = JSON.stringify(value);
      await this._client.set(key, v);
      return value;
    });
  }

  public delete(key?: string | undefined): Promise<void> {
    return this._do(async () => {
      if (key == null) {
        const keys = await this._client.keys('*');
        await this._client.del(keys);
      } else {
        await this._client.del([key]);
      }
    });
  }

  private async _do<T>(fn: () => Promise<T>) {
    try {
      await this._client.connect();
      return await fn();
    } finally {
      await this._client.disconnect();
    }
  }
}
