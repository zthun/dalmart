# Dalmart Storage

This package supplies the implementation for a dalmart layer that connects to local and session storage in the browser.

## Installation

```sh
npm install @zthun/dalmart-storage
yarn add @zthun/dalmart-storage
```

## Usage

```ts
import { IZDatabaseMemory } from '@zthun/dalmart-db';
import { ZDatabaseStorage } from '@zthun/dalmart-storage';

const local: IZDatabaseMemory = new ZDatabaseStorage(localStorage);
const session: IZDatabaseMemory = new ZDatabaseStorage(sessionStorage);

// Do things with local and session.
```
