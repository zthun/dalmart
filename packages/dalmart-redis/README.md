# Dalmart Redis

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

const options = new ZDatabaseOptionsBuilder().url('redis://my-redis.url:1123').timeout(45000).build();
const database: IZDatabaseMemory = new ZDatabaseRedis(options);

// Do things with database.
```
