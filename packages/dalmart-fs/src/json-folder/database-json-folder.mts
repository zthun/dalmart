import { IZDatabaseDocument, IZDatabaseDocumentCollection, IZDatabaseOptions } from '@zthun/dalmart-db';
import {
  IZDataRequest,
  IZDataSource,
  IZFilter,
  ZDataFilterFields,
  ZDataMatchAlways,
  ZDataMatchOptional,
  ZDataRequestBuilder,
  ZDataSourceStatic,
  ZDataSourceStaticOptionsBuilder
} from '@zthun/helpful-query';
import { sync } from 'glob';
import { resolve } from 'node:path';
import { tryReadJson } from '../json-util/json-read';

export class ZDatabaseJsonFolder implements IZDatabaseDocument {
  private _sources: Record<string, IZDataSource<any>> = {};

  public constructor(private readonly _options: IZDatabaseOptions) {}

  public async count(source: string | IZDatabaseDocumentCollection, scope?: IZFilter | undefined): Promise<number> {
    const dataSource = await this._read(typeof source === 'string' ? source : source.name);
    const request = new ZDataRequestBuilder().filter(scope).build();
    return dataSource.count(request);
  }

  public create<T>(source: string, template: T[]): Promise<T[]> {
    throw new Error('Method not implemented.');
  }

  public update<T>(source: string, template: Partial<T>, scope?: IZFilter | undefined): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async read<T>(
    source: string | IZDatabaseDocumentCollection,
    request?: IZDataRequest | undefined
  ): Promise<T[]> {
    const dataSource = await this._read<T>(typeof source === 'string' ? source : source.name);
    const _request = request || new ZDataRequestBuilder().build();
    return dataSource.retrieve(_request);
  }

  public delete(source: string, scope?: IZFilter | undefined): Promise<number> {
    throw new Error('Method not implemented.');
  }

  private async _read<T>(source: string): Promise<IZDataSource<T>> {
    if (Object.prototype.hasOwnProperty.call(this._sources, source)) {
      return this._sources[source];
    }

    const { url = '' } = this._options;
    const path = resolve(url, source);

    const files = sync(`${path}/*.json`);

    const contents = files.map((f) => tryReadJson<T>(f));

    const options = new ZDataSourceStaticOptionsBuilder()
      .search(new ZDataMatchAlways())
      .filter(new ZDataMatchOptional(new ZDataFilterFields()))
      .build();
    this._sources[source] = new ZDataSourceStatic<T>(contents, options);
    return this._sources[source];
  }
}
