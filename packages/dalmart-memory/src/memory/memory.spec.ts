import { createGuid } from '@zthun/helpful-fn';
import { describe, expect, it } from 'vitest';
import { ZMemoryDatabase } from './memory';

describe('Memory', () => {
  const createTestTarget = () => new ZMemoryDatabase();

  describe('Read', () => {
    it('should insert the key if the key does not exist and the fallback is set', async () => {
      // Arrange.
      const key = createGuid();
      const expected = 'Serialized';
      const target = createTestTarget();
      // Act.
      await target.read(key, expected);
      const actual = await target.read(key);
      // Assert.
      expect(actual).toEqual(expected);
    });

    it('should return null if the key does not exist and no fallback is set', async () => {
      // Arrange.
      const key = createGuid();
      const target = createTestTarget();
      // Act.
      const actual = await target.read(key);
      // Assert.
      expect(actual).toBeNull();
    });

    it('should return the fallback if the key does not exist and the fallback is set', async () => {
      // Arrange.
      const key = createGuid();
      const expected = 'Fallback';
      const target = createTestTarget();
      // Act.
      const actual = await target.read(key, expected);
      // Assert.
      expect(actual).toEqual(expected);
    });
  });

  describe('Upsert', () => {
    it('should return the data that was just updated', async () => {
      // Arrange.
      const key = createGuid();
      const expected = { data: 'My-Data' };
      const target = createTestTarget();
      // Act.
      await target.upsert(key, 'some-data');
      const actual = await target.upsert(key, expected);
      // Assert.
      expect(actual).toEqual(expected);
    });

    it('should insert the data if the data does not exist', async () => {
      // Arrange.
      const key = createGuid();
      const expected = { data: 'My-Data' };
      const target = createTestTarget();
      // Act.
      await target.upsert(key, expected);
      const actual = await target.read(key);
      // Assert.
      expect(actual).toEqual(expected);
    });

    it('should update the data in place', async () => {
      // Arrange.
      const expected = 55;
      const key = createGuid();
      const target = createTestTarget();
      // Act.
      await target.upsert(key, 'old-data');
      await target.upsert(key, expected);
      const actual = await target.read(key);
      // Assert.
      expect(actual).toEqual(expected);
    });
  });

  describe('Delete', () => {
    it('should delete a key value', async () => {
      // Arrange.
      const key = createGuid();
      const target = createTestTarget();
      await target.upsert(key, 'data');
      // Act.
      await target.delete(key);
      const actual = await target.read(key);
      // Assert.
      expect(actual).toBeNull();
    });

    it('should delete all keys', async () => {
      // Arrange.
      const keyA = createGuid();
      const keyB = createGuid();
      const target = createTestTarget();
      await target.upsert(keyA, 'data-a');
      await target.upsert(keyB, 'data-b');
      // Act.
      await target.delete();
      const a = await target.read(keyA);
      const b = await target.read(keyB);
      // Assert.
      expect(a).toBeNull();
      expect(b).toBeNull();
    });
  });
});
