/**
 * Represents options for a database.
 */
export interface IZDatabaseOptions {
  /**
   * The name of the database to connect to and modify.
   */
  database?: string;
  /**
   * The database connection string.
   */
  url?: string;
  /**
   * The timeout value for connections.
   */
  timeout?: number;
}

/**
 * Represents an object that can be used to build a database options object.
 */
export class ZDatabaseOptionsBuilder {
  private _options: IZDatabaseOptions;

  /**
   * Initializes a new instance of this object.
   */
  public constructor() {
    this._options = {};
  }

  /**
   * Sets the database to connect to.
   *
   * @param val -
   *        The value to set.
   *
   * @returns
   *        This object.
   */
  public database(val: string): this {
    this._options.database = val;
    return this;
  }

  /**
   * Sets the connection string.
   *
   * @param val -
   *        The connection string.
   *
   * @returns
   *        This object.
   */
  public url(val: string): this {
    this._options.url = val;
    return this;
  }

  /**
   * Sets the timeout.
   *
   * @param val -
   *        The value to set.
   *
   * @returns
   *        This object.
   */
  public timeout(val: number): this {
    this._options.timeout = val;
    return this;
  }

  /**
   * Assigns values from a subset of database options to this object.
   *
   * @param other -
   *        The partial object to assign values from.
   *
   * @returns
   *        This object.
   */
  public assign(other: Partial<IZDatabaseOptions>): this {
    this._options = Object.assign(this._options, other);
    return this;
  }

  /**
   * Copies values from another database options structure to this object.
   *
   * @param other -
   *        The object to copy.
   *
   * @returns
   *        This object.
   */
  public copy(other: IZDatabaseOptions): this {
    this._options = Object.assign({}, other);
    return this;
  }

  /**
   * Builds the options.
   *
   * @returns
   *        A copy of the current options structure.
   */
  public build(): IZDatabaseOptions {
    return { ...this._options };
  }
}
