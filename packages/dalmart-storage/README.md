# Dalmart Storage

This package implements the Dalmart key-value database interface for browser
local and session storage. It accepts a `Storage` object and serializes values
as JSON.

## Installation

Install with npm or Yarn:

```sh
npm install @zthun/dalmart-storage
yarn add @zthun/dalmart-storage
```

## Usage

```ts
import type { IZDatabaseMemory } from "@zthun/dalmart-db";
import { ZDatabaseStorage } from "@zthun/dalmart-storage";

const local: IZDatabaseMemory = new ZDatabaseStorage(localStorage);
const session: IZDatabaseMemory = new ZDatabaseStorage(sessionStorage);

// Do things with local and session.
```
