# Dalmart File System

This package implements Dalmart databases using JSON files on the file system.
It is best suited to small datasets and simple storage needs.

`ZDatabaseJsonFile` stores key-value pairs in a single JSON file.
`ZDatabaseJsonFolder` stores documents in collection subfolders, with one JSON
file per document named after its `_id`. It supports filtering, sorting, and
pagination, but does not support collection joins.

Set the `url` option to a file system path for either implementation.

## Installation

Install with npm or Yarn:

```sh
npm install @zthun/dalmart-fs
yarn add @zthun/dalmart-fs
```

## Usage

```ts
import type { IZDatabaseDocument, IZDatabaseMemory } from "@zthun/dalmart-db";
import { ZDatabaseOptionsBuilder } from "@zthun/dalmart-db";
import { ZDatabaseJsonFile, ZDatabaseJsonFolder } from "@zthun/dalmart-fs";

let options = new ZDatabaseOptionsBuilder()
  .url("/path/to/database.json")
  .build();
const memory: IZDatabaseMemory = new ZDatabaseJsonFile(options);

options = new ZDatabaseOptionsBuilder().url("/path/to/database-folder").build();
const document: IZDatabaseDocument = new ZDatabaseJsonFolder(options);

// Do things with document and memory.
```
