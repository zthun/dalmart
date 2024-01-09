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
import { IZDatabaseDocument, IZDatabaseMemory } from '@zthun/dalmart-db';
import { ZDatabaseJsonFile, ZDatabaseJsonFolder } from '@zthun/dalmart-fs';

let options = new ZDatabaseOptionsBuilder().url('file://path/to/json/file').build();
const memory: IZDatabaseMemory = new ZDatabaseJsonFile(options);

options = new ZDatabaseOptionsBuilder().url('/path/to/folder/with/subfolders').build();
const document: IZDatabaseDocument = new ZDatabaseJsonFolder(options);

// Do things with document and memory.
```
