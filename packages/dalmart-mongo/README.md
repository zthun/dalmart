# Dalmart Mongo

This package supplies the implementation for a dalmart layer that connects to a mongo driver database.

## Installation

```sh
npm install @zthun/dalmart-mongo
yarn add @zthun/dalmart-mongo
```

## Usage

```ts
import { IZDatabaseDocument, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { ZDatabaseMongo } from '@zthun/dalmart-mongo';

const options = new ZDatabaseOptionsBuilder()
  .url('mongodb://my-database.url:8899')
  .database('blah-blahs')
  .timeout(45000)
  .build();
const database: IZDatabaseDocument = new ZDatabaseMongo(options);

// Do things with database.
```
