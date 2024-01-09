import { IZDatabaseOptions, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { IZBrand, ZBrandBuilder } from '@zthun/helpful-brands';
import { ZDataRequestBuilder, ZFilterCollectionBuilder, ZSortBuilder } from '@zthun/helpful-query';
import { rm } from 'node:fs/promises';
import { resolve } from 'node:path';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { ZDatabaseJsonFolder } from './database-json-folder.mjs';

describe('ZDatabaseJsonFolder', () => {
  const temp = resolve(__dirname, '../../.temp');
  const database = resolve(__dirname, '../../.test');

  let options: IZDatabaseOptions;

  afterAll(async () => {
    await rm(temp, { recursive: true, force: true }).catch(() => true);
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
  });
});
