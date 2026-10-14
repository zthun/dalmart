# Dalmart Mongo

This package implements the Dalmart document database interface for MongoDB. It
supports bulk inserts, filtered updates and deletes, counts, sorting,
pagination, and collection joins. The `timeout` option sets the server selection
timeout in milliseconds.

## Installation

Install with npm or Yarn:

```sh
npm install @zthun/dalmart-mongo
yarn add @zthun/dalmart-mongo
```

## Usage

```ts
import type { IZDatabaseDocument } from "@zthun/dalmart-db";
import { ZDatabaseOptionsBuilder } from "@zthun/dalmart-db";
import { ZDatabaseMongo } from "@zthun/dalmart-mongo";

const options = new ZDatabaseOptionsBuilder()
  .url("mongodb://localhost:27017")
  .database("pokemon")
  .timeout(45000)
  .build();
const database: IZDatabaseDocument = new ZDatabaseMongo(options);

// Do things with database.
```
