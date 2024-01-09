import { IZDatabaseOptions, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { createGuid } from '@zthun/helpful-fn';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { ZDatabaseJsonFile } from './database-json-file.mjs';

describe('ZDatabaseJsonContent', () => {
  const tempDir = resolve(__dirname, '../../.temp');
  let options: IZDatabaseOptions;

  const createTestTarget = () => {
    return new ZDatabaseJsonFile(options);
  };

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true }).catch(() => true);
  });

  describe('Read', () => {
    beforeEach(() => {
      const path = resolve(__dirname, '../../.test/marvel/spider-man.json');
      options = new ZDatabaseOptionsBuilder().url(path).build();
    });

    it('should read a json content as a single object with the key as a key into the document', async () => {
      // Arrange.
      const target = createTestTarget();
      // Act.
      const actual = await target.read('name');
      // Assert.
      expect(actual).toEqual('Peter Parker');
    });
  });

  describe('Write', () => {
    let venom: any;

    beforeEach(() => {
      venom = {
        _id: 'venom',
        name: 'Eddie Brock',
        alias: 'Venom'
      };

      const path = resolve(tempDir, createGuid(), 'venom.json');
      options = new ZDatabaseOptionsBuilder().url(path).build();
    });

    it('should add the specific key to the file and save it.', async () => {
      // Arrange.
      const target = createTestTarget();
      const actual = {
        _id: '',
        name: '',
        alias: ''
      };
      // Act.
      const keys = Object.keys(venom);
      await Promise.all(keys.map((k) => target.upsert(k, venom[k])));
      actual._id = await target.read('_id', '');
      actual.name = await target.read('name', '');
      actual.alias = await target.read('alias', '');
      // Assert.
      expect(actual).toEqual(venom);
    });

    it('should delete the key from a file', async () => {
      // Arrange.
      const target = createTestTarget();
      await target.upsert('name', venom.name);
      // Act.
      await target.delete('name');
      const actual = await target.read('name');
      // Assert.
      expect(actual).toBeNull();
    });

    it('should delete all keys from a file', async () => {
      // Arrange.
      const target = createTestTarget();
      await target.upsert('_id', venom._id);
      await target.upsert('name', venom.name);
      await target.upsert('alias', venom.alias);
      // Act.
      await target.delete();
      const values = await Promise.all([target.read('_id'), target.read('name'), target.read('alias')]);
      const actual = values.every((v) => v == null);
      // Assert.
      expect(actual).toBeTruthy();
    });
  });
});
