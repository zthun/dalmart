# Dalmart Database

This is the core package of the Dalmart system. It contains the common database
interfaces, collection declarations, and options builders used by the backend
implementations. It does not connect to a database on its own.

## Installation

Install with npm or Yarn:

```sh
npm install @zthun/dalmart-db
yarn add @zthun/dalmart-db
```

## Document Database

Document databases store documents, usually as JSON-like objects with key-value
pairs. MongoDB is one example of a document database.

Dalmart's document database interface defines create, read, update, delete, and
count operations with bulk operations in mind. To insert one document, pass an
array containing one item; to insert many documents, pass a larger array.
Updates and deletes apply to all documents matching an optional filter and
return the number of documents affected. Omitting the filter updates or deletes
all documents in the collection.

Dalmart uses request, filter, and sort types from `@zthun/helpful-query` to
provide a common API across implementations. Reads accept a data request for
filtering, sorting, and pagination; counts accept a filter. Backend capabilities
can differ: MongoDB supports collection joins, while the JSON folder
implementation does not.

### Document Database Example

```ts
import type { IZDatabaseDocument } from "@zthun/dalmart-db";
import type { IZDataRequest, IZFilter, IZPage } from "@zthun/helpful-query";
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
  ZPageBuilder,
} from "@zthun/helpful-query";

interface IZPokemon {
  _id?: string;
  name: string;
}

export class PokemonService {
  public static readonly Collection = "Pokemon";

  public constructor(private _dal: IZDatabaseDocument) {}

  public async list(req: IZDataRequest): Promise<IZPage<IZPokemon>> {
    const count = await this._dal.count(PokemonService.Collection, req.filter);
    const data = await this._dal.read<IZPokemon>(
      PokemonService.Collection,
      req,
    );
    return new ZPageBuilder().count(count).data(data).build();
  }

  public async get(id: string): Promise<IZPokemon | undefined> {
    const byId = new ZFilterBinaryBuilder()
      .subject("_id")
      .equal()
      .value(id)
      .build();
    const req = new ZDataRequestBuilder().page(1).size(1).filter(byId).build();
    const [result] = await this._dal.read<IZPokemon>(
      PokemonService.Collection,
      req,
    );
    return result;
  }

  public async create(template: IZPokemon): Promise<IZPokemon> {
    // Dalmart always operates with bulk in mind.
    const [result] = await this._dal.create(PokemonService.Collection, [
      template,
    ]);
    return result;
  }

  public async createAll(templates: IZPokemon[]): Promise<IZPokemon[]> {
    return this._dal.create(PokemonService.Collection, templates);
  }

  public update(template: Partial<IZPokemon>, filter: IZFilter) {
    // Everything matching the filter will be updated with the fields in the partial template.
    return this._dal.update(PokemonService.Collection, template, filter);
  }

  public async delete(id: string): Promise<number> {
    const byId = new ZFilterBinaryBuilder()
      .subject("_id")
      .equal()
      .value(id)
      .build();
    return this._dal.delete(PokemonService.Collection, byId);
  }

  public async purge(): Promise<number> {
    // Deletes all documents in the collection.
    return this._dal.delete(PokemonService.Collection);
  }
}
```

## Memory Database

The `IZDatabaseMemory` interface represents key-value storage, including Redis,
browser local and session storage, localForage, and JSON files. Despite the
name, these implementations are not all limited to in-memory storage.

This interface provides `read`, `upsert`, and `delete` operations rather than
queries. A read returns `null` when the key does not exist. You can supply a
fallback value; whether that fallback is persisted depends on the
implementation. Deleting without a key clears all keys in the underlying store.

### Memory Database Example

```ts
import type { IZDatabaseMemory } from "@zthun/dalmart-db";

interface IZPokemon {
  _id?: string;
  name: string;
}

export class PokemonCache {
  public constructor(private _dal: IZDatabaseMemory) {}

  public async read(
    id: string,
    retrieve: () => Promise<IZPokemon>,
  ): Promise<IZPokemon> {
    const result = await this._dal.read<IZPokemon>(id);

    if (result != null) {
      return result;
    }

    const value = await retrieve();
    return this.update(id, value);
  }

  public update(key: string, value: IZPokemon): Promise<IZPokemon> {
    return this._dal.upsert(key, value);
  }

  public async bust(id: string): Promise<void> {
    await this._dal.delete(id);
  }
}
```

## Relational Databases

Dalmart currently supports document and key-value databases. It does not provide
a relational database interface or implementation.
