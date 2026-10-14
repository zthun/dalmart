# Dalmart Memory

This package provides database server implementations for testing. Each server
acts as a factory for a database client implementing a Dalmart interface.

`ZDatabaseServerDocument` starts a MongoDB instance through
`mongodb-memory-server` and returns a `ZDatabaseMongo` client.
`ZDatabaseServerMemory` implements the browser `Storage` interface in memory and
returns a `ZDatabaseStorage` client. Its `stop()` method does not clear stored
values; use `database.delete()` or `server.clear()` to reset them.

## Installation

Install with npm or Yarn:

```sh
npm install @zthun/dalmart-memory
yarn add @zthun/dalmart-memory
```

## Usage

```ts
import type { IZDatabaseMemory, IZDatabaseDocument } from "@zthun/dalmart-db";
import { afterAll, beforeAll, describe } from "vitest";
import type { IZDatabaseServer } from "@zthun/dalmart-memory";
import {
  ZDatabaseServerDocument,
  ZDatabaseServerMemory,
} from "@zthun/dalmart-memory";

describe("In-Memory Database", () => {
  describe("Document", () => {
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

  describe("Memory", () => {
    let server: IZDatabaseServer<IZDatabaseMemory>;
    let database: IZDatabaseMemory;

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
