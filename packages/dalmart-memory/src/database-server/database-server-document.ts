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

  /**
   * A value that determines if the server is running.
   *
   * @returns
   *        True if the server is running, false otherwise.
   */
  public running(): Promise<boolean> {
    return Promise.resolve(this._server != null);
  }

  /**
   * Starts the in memory server and returns the client connection.
   *
   * This will attempt to find a port that can be connected on.  If the connection
   * fails, then a new port will be allocated.
   *
   * @param options -
   *        Optional options to use as a template when constructing the database.
   *        The url is ignored.
   *
   * @returns
   *        A promise that when resolved, has started the server.  If the server
   *        has already been started, then a new client to the existing server
   *        will be returned.
   */
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

  /**
   * Kills the server.
   *
   * @returns
   *        A promise that when resolved, has stopped the server.
   */
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
