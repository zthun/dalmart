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
import { tryReadJson, writeJson } from '../json-util/json-io.mjs';

type TWithDecoration<T> = T & { _id: string };

export class ZDatabaseJsonFolder implements IZDatabaseDocument {
  private readonly _staticOptions = new ZDataSourceStaticOptionsBuilder()
    .search(new ZDataMatchAlways())
    .filter(new ZDataMatchOptional(new ZDataFilterFields()))
    .build();
  private readonly _sources: Record<string, ZDataSourceStatic<any>> = {};

  public constructor(private readonly _options: IZDatabaseOptions) {}

  public async count(source: string | IZDatabaseDocumentCollection, scope?: IZFilter | undefined): Promise<number> {
    const dataSource = this._read(typeof source === 'string' ? source : source.name);
    const request = new ZDataRequestBuilder().filter(scope).build();
    return dataSource.count(request);
  }

  public async create<T>(source: string, template: T[]): Promise<T[]> {
    const folder = this._folder(source);

    const withIds: Array<TWithDecoration<T>> = template.map((t: any) => {
      const _id = this._findDocId(t) || createGuid();
      return { ...t, _id };
    });

    let duplicates = withIds
      .map((t) => t._id)
      .filter((id) => {
        try {
          accessSync(resolve(folder, `${id}.json`));
          return true;
        } catch (_) {
          return false;
        }
      });

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
      const { _id } = t;
      const path = resolve(folder, `${_id}.json`);
      writeJson(t, path);
      return t as T;
    });

    delete this._sources[source];
    return Promise.resolve(written);
  }

  public update<T>(source: string, template: Partial<T>, scope?: IZFilter | undefined): Promise<number> {
    throw new Error('Method not implemented.');
  }

  public async read<T>(
    source: string | IZDatabaseDocumentCollection,
    request?: IZDataRequest | undefined
  ): Promise<T[]> {
    const dataSource = this._read<T>(typeof source === 'string' ? source : source.name);
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

  private _findDocId(doc: any): string | null {
    return doc._id || doc.id;
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
    const id = this._findDocId(doc);
    return resolve(folder, `${id}.json`);
  }

  private _read<T>(source: string): IZDataSource<T> {
    if (Object.prototype.hasOwnProperty.call(this._sources, source)) {
      return this._sources[source];
    }

    const path = this._folder(source);
    const files = sync(`${path}/*.json`);
    const contents = files.map((f) => tryReadJson<T>(f));
    this._sources[source] = new ZDataSourceStatic<T>(contents, this._staticOptions);
    return this._sources[source];
  }
}
