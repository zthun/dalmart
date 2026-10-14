# Dalmart Forage

Dalmart Forage implements the Dalmart key-value interface using localForage for
browser storage, including IndexedDB. The database option configures the
localForage storage name.

## Installation

Install with npm or Yarn:

```sh
npm install @zthun/dalmart-forage
yarn add @zthun/dalmart-forage
```

## Usage

```ts
import type { IZDatabaseMemory } from "@zthun/dalmart-db";
import { ZDatabaseOptionsBuilder } from "@zthun/dalmart-db";
import { ZDatabaseForage } from "@zthun/dalmart-forage";

const options = new ZDatabaseOptionsBuilder().database("local-data").build();
const database: IZDatabaseMemory = new ZDatabaseForage(options);

// Use database.read(), database.upsert(), and database.delete().
```
