import { IZDatabaseMemory, IZDatabaseOptions } from '@zthun/dalmart-db';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { dirname } from 'path';

/**
 * Represents a memory database where the data is housed in a single json file.
 */
export class ZDatabaseJsonFile implements IZDatabaseMemory {
  private _content: any;

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
    await this._write(content);
    return value;
  }

  public async delete(key?: string | undefined): Promise<void> {
    let content = await this._read();

    if (key) {
      delete content[key];
    } else {
      content = {};
    }

    await this._write(content);
  }

  private async _read(): Promise<any> {
    if (this._content != null) {
      return Promise.resolve(this._content);
    }

    const { url = '' } = this._options;

    try {
      const buffer = await readFile(url);
      return JSON.parse(buffer.toString());
    } catch (_) {
      this._content = {};
    }

    return Promise.resolve(this._content);
  }

  private async _write(content: any): Promise<void> {
    const { url = '' } = this._options;
    const dir = dirname(url);
    await mkdir(dir, { recursive: true });
    const data = JSON.stringify(content, undefined, 2);
    await writeFile(url, data, { flag: 'w+' });
    this._content = null;
  }
}
