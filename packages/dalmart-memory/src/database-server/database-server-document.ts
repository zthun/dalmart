import { IZDatabaseDocument, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { ZDatabaseMongo } from '@zthun/dalmart-mongo';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { IZDatabaseServer } from './database-server';

/**
 * Represents an in memory database server for document databases.
 *
 * This uses mongo under the hood.
 */
export class ZDatabaseServerDocument implements IZDatabaseServer<IZDatabaseDocument> {
  private _server: MongoMemoryServer | null;
  private _client: IZDatabaseDocument | null;

  public running(): Promise<boolean> {
    return Promise.resolve(this._server != null);
  }

  public async start(options = new ZDatabaseOptionsBuilder().build()): Promise<IZDatabaseDocument> {
    if (this._client) {
      return this._client;
    }

    this._server = new MongoMemoryServer();
    await this._server.start(false);
    const { ip, port } = this._server.instanceInfo!;
    const _options = new ZDatabaseOptionsBuilder().copy(options).url(`mongodb://${ip}:${port}`).build();
    this._client = new ZDatabaseMongo(_options);
    return this._client;
  }

  public async stop(): Promise<boolean> {
    if (!this._server) {
      return true;
    }

    const killed = await this._server.stop({ doCleanup: true });
    this._server = null;
    this._client = null;
    return killed;
  }
}
