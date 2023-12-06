# Dalmart Memory

This package contains in memory database server objects that are meant for mock implementations for unit testing.

The difference between this and other dalmart packages is that this package only includes server implementations instead
of database implementations. The server implementations act as a factory for the actual database implementation.

## Usage

```sh
npm install @zthun/dalmart-memory
yarn add @zthun/dalmart-memory
```

## Example

```ts
import { IZDatabaseMemory, IZDatabaseDocument } from '@zthun/dalmart-db';
import { IZDatabaseServer, ZDatabaseServerDocument, ZDatabaseServerMemory } from '@zthun/dalmart-memory';

describe('In Memory Database', () => {
  describe('Document', () => {
    let server: IZDatabaseServer<IZDatabaseDocument>;
    let database: IZDatabaseDocument;

    beforeAll(async () => {
      server = new ZDatabaseServerDocument();
      database = await server.start();
    });

    afterAll(async () => {
      await server.stop();
    });
  });

  describe('Memory', () => {
    let server: IZDatabaseServer<IZDatabaseDocument>;
    let database: IZDatabaseDocument;

    beforeAll(async () => {
      server = new ZDatabaseServerMemory();
      database = await server.start();
    });

    afterAll(async () => {
      await server.stop();
    });
  });
});
```
