import { createGuid } from '@zthun/helpful-fn';
import { describe, expect, it } from 'vitest';
import { ZDatabaseServerMemory } from './database-server-memory';

describe('ZDatabaseServerMemory', () => {
  const createTestTarget = () => new ZDatabaseServerMemory();

  describe('Storage', () => {
    describe('Keys', () => {
      it('should return the total number of keys', () => {
        // Arrange.
        const target = createTestTarget();
        target.setItem('a', '2');
        target.setItem('b', '3');
        // Act.
        const actual = target.length;
        // Assert.
        expect(actual).toEqual(2);
      });

      it('should return the key at a specific index', () => {
        // Arrange.
        const target = createTestTarget();
        target.setItem('a', '2');
        target.setItem('b', '3');
        // Act.
        const actual = target.key(1);
        // Assert.
        expect(actual).toEqual('b');
      });

      it('should return null if no key is at the index', () => {
        // Arrange.
        const target = createTestTarget();
        // Act.
        const actual = target.key(0);
        // Assert.
        expect(actual).toBeNull();
      });
    });
  });

  describe('Server', () => {
    it('should set an item key', async () => {
      // Arrange.
      const key = createGuid();
      const expected = 2;
      const target = await createTestTarget().start();
      // Act.
      await target.upsert(key, expected);
      const actual = await target.read<number>(key);
      // Assert.
      expect(actual).toEqual(expected);
    });

    it('should remove an item key', async () => {
      // Arrange.
      const key = createGuid();
      const target = await createTestTarget().start();
      await target.upsert(key, 'whatever');
      // Act.
      await target.delete(key);
      const actual = await target.read(key);
      // Assert.
      expect(actual).toBeNull();
    });

    it('should remove all keys', async () => {
      // Arrange.
      const target = createTestTarget();
      const database = await target.start();
      await database.upsert(createGuid(), 'whatever');
      await database.upsert(createGuid(), 'again-whatever');
      // Act.
      await database.delete();
      const actual = target.length;
      // Assert.
      expect(actual).toEqual(0);
    });

    it('should always return true for running', async () => {
      // Arrange.
      const target = createTestTarget();
      // Act.
      const actual = await target.running();
      // Assert.
      expect(actual).toBeTruthy();
    });

    it('should return false for stop as there is no actual server to run', async () => {
      // Arrange.
      const target = createTestTarget();
      await target.start();
      // Act.
      const actual = await target.stop();
      // Assert.
      expect(actual).toBeFalsy();
    });
  });
});
