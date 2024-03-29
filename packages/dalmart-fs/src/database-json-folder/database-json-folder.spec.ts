import { IZDatabaseOptions, ZDatabaseDocumentCollectionBuilder, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
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
import { afterAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { IZDocumentWithId, ZDocumentWithDecoration } from '../json-util/document-with-decoration.mjs';
import * as utils from '../json-util/json-io.mjs';
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
    const databaseBrands = 'brands';

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
      const brands = await target.read<IZDocumentWithId>(databaseBrands);
      const actual = brands.map((b) => b._id);
      // Actual.
      expect(actual).toContain(facebook);
      expect(actual).toContain(instagram);
      expect(actual).toContain(tiktok);
      expect(actual).toContain(x);
    });

    it('should cache the documents', async () => {
      // Arrange.
      const target = createTestTarget();
      await target.read<IZBrand>(databaseBrands);
      vi.spyOn(utils, 'tryReadJson');
      // Act.
      await target.read<IZBrand>(databaseBrands);
      // Assert.
      expect(utils.tryReadJson).not.toHaveBeenCalled();
    });

    it('should query all documents sorted by the given sort order', async () => {
      // Arrange.
      const target = createTestTarget();
      const sort = new ZSortBuilder().descending('name').build();
      const request = new ZDataRequestBuilder().sort(sort).build();
      // Act.
      const brands = await target.read<IZBrand>(databaseBrands, request);
      const actual = brands.map((b) => b.name);
      const expected = actual.slice().sort((x, y) => (x < y ? 1 : x > y ? -1 : 0));
      // Assert.
      expect(actual).toEqual(expected);
    });

    it('should return the appropriate count of documents', async () => {
      // Arrange.
      const target = createTestTarget();
      // Act.
      const actual = await target.count(databaseBrands);
      // Assert.
      expect(actual).toBeGreaterThan(0);
    });

    it('should return the count given the filter', async () => {
      // Arrange.
      const target = createTestTarget();
      const filter = new ZFilterCollectionBuilder().subject('_id').in().values(['facebook', 'tiktok']).build();
      // Act.
      const actual = await target.count(databaseBrands, filter);
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

    it('should reject with not support for a join set while reading', async () => {
      // Arrange.
      const collection = new ZDatabaseDocumentCollectionBuilder(databaseBrands)
        .join(databaseBrands, 'owner', '_id', 'owners')
        .build();
      const target = createTestTarget();
      // Act.
      const actual = target.read(collection);
      // Assert.
      await expect(actual).rejects.toBeTruthy();
    });

    it('should reject with not support for a join set while counting', async () => {
      // Arrange.
      const collection = new ZDatabaseDocumentCollectionBuilder(databaseBrands)
        .join(databaseBrands, 'owner', '_id', 'owners')
        .build();
      const target = createTestTarget();
      // Act.
      const actual = target.count(collection);
      // Assert.
      await expect(actual).rejects.toBeTruthy();
    });
  });

  describe('Write', () => {
    const databaseCompanies = 'companies';
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
        const [$airbnb, $youtube] = await target.create(databaseCompanies, [airbnb, youtube]);
        // Assert.
        expect($airbnb).toEqual(airbnb);
        expect($youtube).toEqual(youtube);
      });

      it('should persist the data', async () => {
        // Arrange.
        const target = createTestTarget();
        await target.read(databaseCompanies);
        // Act.
        await target.create(databaseCompanies, [airbnb, youtube]);
        const brands = await target.read<IZBrand>(databaseCompanies);
        const actual = brands.map((brand) => brand.id);
        // Assert.
        expect(actual).toContain(airbnb.id);
        expect(actual).toContain(youtube.id);
      });

      it('should return a rejected promise if there are documents that already exist with the given id', async () => {
        // Arrange.
        const target = createTestTarget();
        let facebook = new ZBrandBuilder().facebook().build();
        [facebook] = await target.create(databaseCompanies, [facebook]);
        // Act.
        const actual = target.create(databaseCompanies, [facebook]);
        // Assert
        await expect(actual).rejects.toBeTruthy();
      });

      it('should return a rejected promise if there are duplicate ids in the given template set', async () => {
        // Arrange.
        const target = createTestTarget();
        // Act.
        const actual = target.create(databaseCompanies, [youtube, airbnb, youtube]);
        // Assert
        await expect(actual).rejects.toBeTruthy();
      });

      it('should always add an _id field', async () => {
        const target = createTestTarget();
        const facebook: ZDocumentWithDecoration<IZBrand> = new ZBrandBuilder().facebook().build();
        facebook.id = '';
        // Act.
        const [actual] = await target.create<ZDocumentWithDecoration<IZBrand>>('companies', [facebook]);
        // Assert.
        expect(actual._id).toBeTruthy();
      });
    });

    describe('Update', () => {
      it('should set the fields that matches the filter', async () => {
        // Arrange.
        const target = createTestTarget();
        const expected = { name: 'YouTube (Google)' };
        [youtube, airbnb] = await target.create(databaseCompanies, [youtube, airbnb]);
        const filter = new ZFilterBinaryBuilder().subject('_id').equal().value(youtube._id).build();
        const request = new ZDataRequestBuilder().filter(filter).build();
        // Act.
        const actual = await target.update<IZBrand>(databaseCompanies, expected, filter);
        [youtube] = await target.read(databaseCompanies, request);
        // Assert.
        expect(actual).toEqual(1);
        expect(youtube.name).toEqual(expected.name);
      });

      it('should set the fields for all documents', async () => {
        // Arrange.
        const target = createTestTarget();
        await target.create(databaseCompanies, [youtube, airbnb]);
        // Act.
        const actual = await target.update<IZBrand>(databaseCompanies, { name: '' });
        // Assert.
        expect(actual).toEqual(2);
      });

      it('should reject if an attempt is made to change the _id', async () => {
        // Arrange.
        const target = createTestTarget();
        [youtube, airbnb] = await target.create(databaseCompanies, [youtube, airbnb]);
        const filter = new ZFilterBinaryBuilder().subject('_id').equal().value(youtube._id).build();
        // Act.
        const actual = target.update<IZDocumentWithId>(databaseCompanies, { _id: 'not-allowed' }, filter);
        // Assert.
        await expect(actual).rejects.toBeTruthy();
      });
    });

    describe('Delete', () => {
      it('should delete the files that match the filters', async () => {
        // Arrange.
        const target = createTestTarget();
        await target.create(databaseCompanies, [youtube, airbnb]);
        const filter = new ZFilterBinaryBuilder().subject('_id').equal().value(youtube._id).build();
        // Act.
        const deleted = await target.delete(databaseCompanies, filter);
        const actual = await target.count(databaseCompanies);
        // Assert.
        expect(deleted).toEqual(1);
        expect(actual).toEqual(1);
      });

      it('should delete all documents', async () => {
        // Arrange.
        const target = createTestTarget();
        await target.create(databaseCompanies, [youtube, airbnb]);
        // Act.
        const deleted = await target.delete(databaseCompanies);
        const actual = await target.count(databaseCompanies);
        // Assert.
        expect(deleted).toEqual(2);
        expect(actual).toEqual(0);
      });
    });
  });
});
