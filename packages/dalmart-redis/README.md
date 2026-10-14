# Dalmart Redis

This package implements the Dalmart key-value database interface for Redis.
Values are serialized as JSON. The implementation uses the `url` option;
`database` and `timeout` are not currently used.

## Installation

Install with npm or Yarn:

```sh
npm install @zthun/dalmart-redis
yarn add @zthun/dalmart-redis
```

## Usage

```ts
import type { IZDatabaseMemory } from "@zthun/dalmart-db";
import { ZDatabaseOptionsBuilder } from "@zthun/dalmart-db";
import { ZDatabaseRedis } from "@zthun/dalmart-redis";

const options = new ZDatabaseOptionsBuilder()
  .url("redis://localhost:6379")
  .build();
const database: IZDatabaseMemory = new ZDatabaseRedis(options);

// Do things with database.
```
