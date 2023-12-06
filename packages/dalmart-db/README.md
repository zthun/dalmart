# Dalmart Database

This is the root package of the dalmart system. This package contains all of the generic options and interface
declarations that are needed to grab a connection to a database server.

## Installation

```sh
npm install @zthun/dalmart-db
yarn add @zthun/dalmart-db
```

## Document Database

Document databases store "documents," usually in a json like format with key value pairs for quick lookups and queries.
The most popular document database that most people know is [mongo](https://www.mongodb.com/).

Dalmart's document database layer comes with the needed method implementations for create, read, update, and delete;
however, unlike systems such as mongoose, which only operate on a single document at a time, dalmart is build with bulk
in mind. Rather than updating documents one by one, every CRUD operation assumes that you want to do bulk operations out
of the box. This means, that if you want to do one document, you pass a collection with 1 item in it instead of calling
a different method, or worse, looping through a list and inserting, updating, or removing one at a time.

Dalmart also makes use of [@zthun/helpful-query](https://helpful.zthunworks.com/modules/_zthun_helpful_query.html) to do
the sorting and filtering, abstracting away the need to have vendor locked apis around those operations. This makes it
so a dalmart implementation supplies the L in SOLID. You can simply substitute any implementation of a document database
with a different vendor and it's a drop in place operation.

### Document Database Example

```ts
import { IZDatabaseDocument } from '@zthun/dalmart-db';
import { ZFilterBinaryBuilder, IZPage, ZPageBuilder } from '@zthun/helpful-query';

export class PokemonService {
  public static readonly Collection = 'Pokemon';

  public constructor(private _dal_: IZDatabaseDocument) {}

  public async list(req: IZDataRequest): Promise<IZPage<IZPokemon>> {
    const count = await this._dal.count(PokemonService.Collection, req);
    const data = await this._dal.read(PokemonService.Collection, req);
    return new ZPageBuilder().count(count).data(data).build();
  }

  public async get(id: string): Promise<IZPokemon | undefined> {
    const byId = new ZDataFilterBinaryBuilder().subject('_id').equals().value(id).build();
    const req = new ZDataRequestBuilder().page(1).size(1).filter(byId).build();
    const [result] = await this._dal.read(PokemonService.Collection, req);
    return result;
  }

  public async create(template: IZPokemon): Promise<IZPokemon> {
    // Dalmart always operates with bulk in mind.
    const [result] = await this._dal.create(PokemonService.Collection, [template]);
    return result;
  }

  public async createAll(templates: IZPokemon[]): Promise<IZPokemon[]> {
    return this._dal.create(PokemonService.Collection, templates);
  }

  public update(template: Partial<IZPokemon>, filter: IZFilter) {
    // Everything matching the filter will be updated with the given template partial.
    return this._dal.update(PokemonService.Collection, template, filter);
  }

  public delete(id: string) {
    const byId = new ZDataFilterBinaryBuilder().subject('_id').equals().value(id).build();
    await this._dal.delete(PokemonService.Collection, byId);
  }

  public purge() {
    // Dumps the entire collection.
    await this._dal.delete(PokemonService.Collection);
  }
}
```

## Memory Database

Memory databases are different than document and relational databases. Memory databases use key value pair lookups to
store and retrieve data. If you have ever used
[localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage),
[sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage), or [redis](https://redis.io/),
you will be familiar with this concept.

Unlike document databases, these kinds of database do not have query support and are mostly useful when you need quick
lookups of data. The two main concepts of them are **read** and **upsert**.

### Memory Database Example

```ts
export class PokemonCache {
  public constructor(private _dal: IZDatabaseMemory) {}

  public async read(id: string, retrieve: () => Promise<IZPokemon>) {
    const result = await this._dal.read(id);

    if (result != null) {
      return result;
    }

    const value = await retrieve();
    return this.put(id, value);
  }

  public update(key: string, value: IZPokemon): Promise<IZPokemon> {
    return this._dal.upsert(key, value);
  }

  public bust(id: string): Promise<void> {
    await this._dal.delete(key);
  }
}
```

## Relational Database

Currently, Dalmart does not support relational databases as these are MUCH more complex than the others. This may come
in the future if the need comes up, but for now, only document and memory databases are supported.
