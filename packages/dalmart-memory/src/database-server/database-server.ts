import { IZDatabaseOptions } from '@zthun/dalmart-db';

/**
 * Represents a server that runs an in-memory database.
 *
 * The implementation of the server acts as a factory to
 * construct the client connections to the in memory database.
 *
 * @param TDatabase -
 *        The type of database that will be returned when the
 *        server is started.
 */
export interface IZDatabaseServer<TDatabase> {
  /**
   * Gets whether the database server is running.
   *
   * @returns
   *        True if the server is running. False otherwise.
   */
  running(): Promise<boolean>;
  /**
   * Starts the server.
   *
   * @param options -
   *        Optional options to use when starting the database.
   *
   * @returns
   *        The client that is connected or can connect to the
   *        server.
   */
  start(options?: IZDatabaseOptions): Promise<TDatabase>;
  /**
   * Stops the server.
   *
   * @returns
   *        True if the server is stopped.  False otherwise.
   */
  stop(): Promise<boolean>;
}
