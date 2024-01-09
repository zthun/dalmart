import { IZDatabaseDocument, IZDatabaseDocumentCollection, IZDatabaseOptions } from '@zthun/dalmart-db';
import { createGuid } from '@zthun/helpful-fn';
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
import { groupBy, toPairs } from 'lodash-es';
import { accessSync, rmSync } from 'node:fs';
import { resolve } from 'node:path';
import { ZDocumentWithDecoration } from 'src/json-util/document-with-decoration.mjs';
import { tryReadJson, writeJson } from '../json-util/json-io.mjs';

export class ZDatabaseJsonFolder implements IZDatabaseDocument {
  private readonly _staticOptions = new ZDataSourceStaticOptionsBuilder()
    .search(new ZDataMatchAlways())
    .filter(new ZDataMatchOptional(new ZDataFilterFields()))
    .build();
  private readonly _sources: Record<string, ZDataSourceStatic<any>> = {};

  public constructor(private readonly _options: IZDatabaseOptions) {}

  public async count(source: string | IZDatabaseDocumentCollection, scope?: IZFilter | undefined): Promise<number> {
    const dataSource = this._read(source);
    const request = new ZDataRequestBuilder().filter(scope).build();
    return dataSource.count(request);
  }

  public async create<T>(source: string, template: T[]): Promise<T[]> {
    const withIds: Array<ZDocumentWithDecoration<T>> = template.map((t: any) => ({ ...t, _id: t._id || createGuid() }));

    let duplicates = withIds
      .filter((t) => {
        try {
          accessSync(this._file(source, t));
          return true;
        } catch (_) {
          return false;
        }
      })
      .map((t) => t._id);

    if (duplicates.length > 0) {
      const err = new Error(`Duplicate ids detected, [${duplicates.join(', ')}].  Use update instead`);
      return Promise.reject(err);
    }

    duplicates = toPairs(groupBy(withIds, (t) => t._id))
      .filter(([, v]) => v.length > 1)
      .map(([k]) => k);

    if (duplicates.length > 0) {
      const list = duplicates.join(', ');
      const msg = `Duplicate keys detected in template set, [${list}].  Make sure all id fields are unique.`;
      const err = new Error(msg);
      return Promise.reject(err);
    }

    const written = withIds.map((t: any) => {
      const path = this._file(source, t);
      writeJson(t, path);
      return t as T;
    });

    delete this._sources[source];
    return Promise.resolve(written);
  }

  public async update<T>(source: string, template: Partial<T>, scope?: IZFilter | undefined): Promise<number> {
    const dataSource = this._read(source);
    const request = new ZDataRequestBuilder().filter(scope).build();
    const values = await dataSource.retrieve(request);

    if (Object.prototype.hasOwnProperty.call(template, '_id')) {
      return Promise.reject(new Error('You are not allowed to change the _id property on a document.'));
    }

    values.forEach((t) => {
      const path = this._file(source, t);
      const n = Object.assign({}, t, template);
      writeJson(n, path);
    });

    delete this._sources[source];
    return Promise.resolve(values.length);
  }

  public async read<T>(
    source: string | IZDatabaseDocumentCollection,
    request?: IZDataRequest | undefined
  ): Promise<T[]> {
    const dataSource = this._read<T>(source);
    const _request = request || new ZDataRequestBuilder().build();
    return dataSource.retrieve(_request);
  }

  public async delete(source: string, scope?: IZFilter | undefined): Promise<number> {
    const request = new ZDataRequestBuilder().filter(scope).build();
    const dataSource = this._read(source);
    const targets = await dataSource.retrieve(request);
    targets.forEach((t) => rmSync(this._file(source, t), { force: true }));
    delete this._sources[source];
    return targets.length;
  }

  private _folder(source: string): string {
    const { url } = this._options;

    if (url == null) {
      throw new Error('Options url is required');
    }

    return resolve(url, source);
  }

  private _file(source: string, doc: any): string {
    const folder = this._folder(source);
    const { _id } = doc;
    return resolve(folder, `${_id}.json`);
  }

  private _read<T>(source: string | IZDatabaseDocumentCollection): IZDataSource<T> {
    const _source = typeof source === 'string' ? source : source.name;

    if (typeof source === 'object' && source.join != null) {
      throw new Error('Joins with a file system document database are currently not supported');
    }

    if (Object.prototype.hasOwnProperty.call(this._sources, _source)) {
      return this._sources[_source];
    }

    const path = this._folder(_source);
    const files = sync(`${path}/*.json`);
    const contents = files.map((f) => tryReadJson<T>(f));
    this._sources[_source] = new ZDataSourceStatic<T>(contents, this._staticOptions);
    return this._sources[_source];
  }
}
