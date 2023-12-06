# Dalmart Forage

Dalmart Forage adds a dalmart memory database for usage of a browser's IndexedDb feature.

## Usage

```sh
npm install @zthun/dalmart-forage
yarn add @zthun/dalmart-forage
```

## Example

```ts
import { IZDatabaseMemory, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { ZDatabaseForage } from '@zthun/dalmart-forage';

const options = new ZDatabaseOptionsBuilder().database('local-data');
const database: IZDatabaseMemory = new ZDatabaseForage(options);
```
