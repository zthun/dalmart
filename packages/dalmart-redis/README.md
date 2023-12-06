# Dalmart Mongo

This package supplies the implementation for a dalmart layer that connects to a [redis](https://redis.io/) database.

## Installation

```sh
npm install @zthun/dalmart-redis
yarn add @zthun/dalmart-redis
```

## Usage

```ts
import { IZDatabaseDocument, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { ZDatabaseRedis } from '@zthun/dalmart-redis';

const options = new ZDatabaseOptionsBuilder()
  .url('redis://my-database.url:8899')
  .database('blah-blahs')
  .timeout(45000)
  .build();
const database: IZDatabaseMemory = new ZDatabaseRedis(options);

// Do things with database.
```
