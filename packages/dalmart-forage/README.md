# Dalmart Forage

Dalmart Forage adds a dalmart memory database for usage of a browser's IndexedDb feature.

## Installation

```sh
npm install @zthun/dalmart-forage
yarn add @zthun/dalmart-forage
```

## Usage

```ts
import { IZDatabaseMemory, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { ZDatabaseForage } from '@zthun/dalmart-forage';

const options = new ZDatabaseOptionsBuilder().database('local-data');
const database: IZDatabaseMemory = new ZDatabaseForage(options);

// Do stuff with database
```
