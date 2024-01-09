import { IZDatabaseMemory, IZDatabaseOptions } from '@zthun/dalmart-db';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { tryReadJson } from '../json-util/json-read';

/**
 * Represents a memory database where the data is housed in a single json file.
 */
export class ZDatabaseJsonFile implements IZDatabaseMemory {
  private _content: Promise<unknown>;

  /**
   * Initializes a new instance of this object.
   *
   * @param _options -
   *        The options for the database.  The url is the only field used.
   */
  public constructor(private readonly _options: IZDatabaseOptions) {}

  public read<T>(key: string): Promise<T | null>;
  public read<T>(key: string, fallback: T): Promise<T>;

  public async read<T>(key: string, fallback?: T): Promise<T | null> {
    const content = await this._read();

    if (!Object.prototype.hasOwnProperty.call(content, key)) {
      return fallback === undefined ? null : fallback;
    }

    return content[key];
  }

  public async upsert<T>(key: string, value: T): Promise<T> {
    const content = await this._read();
    content[key] = value;
    this._write(content);
    return value;
  }

  public async delete(key?: string | undefined): Promise<void> {
    let content = await this._read();

    if (key) {
      delete content[key];
    } else {
      content = {};
    }

    this._write(content);
  }

  private _url(): string {
    const { url } = this._options;

    if (url == null) {
      throw new Error('Options url is required');
    }

    return url;
  }

  private _read(): Promise<any> {
    if (this._content != null) {
      return this._content;
    }

    const url = this._url();
    this._content = Promise.resolve(tryReadJson(url));
    return this._content;
  }

  private _write(content: unknown): void {
    const url = this._url();

    const dir = dirname(url);
    mkdirSync(dir, { recursive: true });
    const data = JSON.stringify(content, undefined, 2);
    writeFileSync(url, data, { flag: 'w+' });
    this._content = Promise.resolve(content);
  }
}
