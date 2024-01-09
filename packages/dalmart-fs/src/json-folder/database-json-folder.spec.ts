import { IZDatabaseOptions, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { IZBrand, ZBrandBuilder } from '@zthun/helpful-brands';
import { createGuid } from '@zthun/helpful-fn';
import {
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
  ZFilterCollectionBuilder,
  ZSortBuilder
} from '@zthun/helpful-query';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ZDatabaseJsonFolder } from './database-json-folder.mjs';

describe('ZDatabaseJsonFolder', () => {
  const temp = resolve(__dirname, '../../.temp');
  const database = resolve(__dirname, '../../.test');

  let options: IZDatabaseOptions;

  afterAll(async () => {
    await rm(temp, { recursive: true, force: true });
  });

  const createTestTarget = () => new ZDatabaseJsonFolder(options);

  describe('Read', () => {
    beforeEach(() => {
      options = new ZDatabaseOptionsBuilder().url(database).build();
    });

    it('should query all documents in the source folder', async () => {
      // Arrange.
      const target = createTestTarget();
      const facebook = new ZBrandBuilder().facebook().build().id;
      const instagram = new ZBrandBuilder().instagram().build().id;
      const tiktok = new ZBrandBuilder().tiktok().build().id;
      const x = new ZBrandBuilder().x().build().id;
      // Act.
      const brands = await target.read<IZBrand>('brands');
      const actual = brands.map((b) => b.id);
      // Actual.
      expect(actual).toContain(facebook);
      expect(actual).toContain(instagram);
      expect(actual).toContain(tiktok);
      expect(actual).toContain(x);
    });

    it('should query all documents sorted by the given sort order', async () => {
      // Arrange.
      const target = createTestTarget();
      const sort = new ZSortBuilder().descending('name').build();
      const request = new ZDataRequestBuilder().sort(sort).build();
      // Act.
      const brands = await target.read<IZBrand>('brands', request);
      const actual = brands.map((b) => b.name);
      const expected = actual.slice().sort((x, y) => (x < y ? 1 : x > y ? -1 : 0));
      // Assert.
      expect(actual).toEqual(expected);
    });

    it('should return the appropriate count of documents', async () => {
      // Arrange.
      const target = createTestTarget();
      // Act.
      const actual = await target.count('brands');
      // Assert.
      expect(actual).toBeGreaterThan(0);
    });

    it('should return the count given the filter', async () => {
      // Arrange.
      const target = createTestTarget();
      const filter = new ZFilterCollectionBuilder().subject('id').in().values(['facebook', 'tiktok']).build();
      // Act.
      const actual = await target.count('brands', filter);
      // Assert
      expect(actual).toEqual(2);
    });

    it('should reject if the options url is undefined', async () => {
      // Arrange.
      options = new ZDatabaseOptionsBuilder().build();
      const target = createTestTarget();
      // Act.
      const actual = target.read('any');
      // Assert.
      await expect(actual).rejects.toBeTruthy();
    });
  });

  describe('Write', () => {
    let tempDatabase: string;
    let youtube: IZBrand & { _id?: string };
    let airbnb: IZBrand & { _id?: string };

    beforeEach(() => {
      tempDatabase = resolve(temp, createGuid());
      airbnb = new ZBrandBuilder().airbnb().build();
      airbnb = { ...airbnb, _id: airbnb.id };
      youtube = new ZBrandBuilder().youtube().build();
      youtube = { ...youtube, _id: youtube.id };
      options = new ZDatabaseOptionsBuilder().url(tempDatabase).build();
    });

    afterEach(async () => {
      await rm(tempDatabase, { recursive: true, force: true });
    });

    describe('Create', () => {
      it('should create the collection and document if it does not exist', async () => {
        // Arrange.
        const target = createTestTarget();
        // Act.
        const [$airbnb, $youtube] = await target.create('companies', [airbnb, youtube]);
        // Assert.
        expect($airbnb).toEqual(airbnb);
        expect($youtube).toEqual(youtube);
      });

      it('should persist the data', async () => {
        // Arrange.
        const target = createTestTarget();
        // Act.
        await target.create('companies', [airbnb, youtube]);
        const brands = await target.read<IZBrand>('companies');
        const actual = brands.map((brand) => brand.id);
        // Assert.
        expect(actual).toContain(airbnb.id);
        expect(actual).toContain(youtube.id);
      });

      it('should return a rejected promise if there are documents that already exist with the given id', async () => {
        // Arrange.
        const target = createTestTarget();
        const facebook = new ZBrandBuilder().facebook().build();
        await target.create('companies', [facebook]);
        // Act.
        const actual = target.create('companies', [facebook]);
        // Assert
        await expect(actual).rejects.toBeTruthy();
      });

      it('should return a rejected promise if there are duplicate ids in the given template set', async () => {
        // Arrange.
        const target = createTestTarget();
        const facebook = new ZBrandBuilder().facebook().build();
        const x = new ZBrandBuilder().x().build();
        // Act.
        const actual = target.create('companies', [facebook, x, facebook]);
        // Assert
        await expect(actual).rejects.toBeTruthy();
      });
    });

    describe('Delete', () => {
      it('should delete the files that match the filters', async () => {
        // Arrange.
        const target = createTestTarget();
        const source = 'companies';
        await target.create(source, [youtube, airbnb]);
        const filter = new ZFilterBinaryBuilder().subject('_id').equal().value(youtube._id).build();
        // Act.
        const deleted = await target.delete(source, filter);
        const actual = await target.count(source);
        // Assert.
        expect(deleted).toEqual(1);
        expect(actual).toEqual(1);
      });

      it('should delete all documents', async () => {
        // Arrange.
        const target = createTestTarget();
        const source = 'companies';
        await target.create(source, [youtube, airbnb]);
        // Act.
        const deleted = await target.delete(source);
        const actual = await target.count(source);
        // Assert.
        expect(deleted).toEqual(2);
        expect(actual).toEqual(0);
      });
    });
  });
});
