# Dalmart Mongo

This package supplies the implementation for a dalmart layer that simulates databases directly using a file system. This
type of database is best used when you need a very cheap storage solution and you don't expect many records in a
database.

## Installation

```sh
npm install @zthun/dalmart-fs
yarn add @zthun/dalmart-fs
```

## Usage

```ts
import { IZDatabaseDocument } from '@zthun/dalmart-db';
import { ZDatabaseFileSystem } from '@zthun/dalmart-fs';

const options = new ZDatabaseOptionsBuilder().url('file://path/to/json/file').build();
const memory: IZDatabaseDocument = new ZDatabaseJsonFile(path);

// Do things with document and memory.
```
