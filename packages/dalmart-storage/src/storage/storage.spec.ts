import { IZDatabaseMemory } from '@zthun/dalmart-db';
import { createGuid } from '@zthun/helpful-fn';
import { afterAll, beforeEach, describe, expect, it } from 'vitest';
import { ZDatabaseStorage } from './storage';

describe('Storage', () => {
  afterAll(async () => {
    await new ZDatabaseStorage(localStorage).delete();
    await new ZDatabaseStorage(sessionStorage).delete();
  });

  const shouldReturnTheFallbackIfTheKeyIsNotSet = async (createTestTarget: () => IZDatabaseMemory) => {
    // Arrange.
    const key = createGuid();
    const expected = 'Fallback';
    const target = createTestTarget();
    // Act.
    const actual = await target.read(key, expected);
    // Assert.
    expect(actual).toEqual(expected);
  };

  const shouldInsertTheKeyIfTheKeyDoesNotExistAndTheFallbackIsSet = async (
    createTestTarget: () => IZDatabaseMemory
  ) => {
    // Arrange.
    const key = createGuid();
    const expected = 'Serialized';
    const target = createTestTarget();
    // Act.
    await target.read(key, expected);
    const actual = await target.read(key);
    // Assert.
    expect(actual).toEqual(expected);
  };

  const shouldReturnNullIfTheKeyDoesNotExistAndTheFallbackIsNotSet = async (
    createTestTarget: () => IZDatabaseMemory
  ) => {
    // Arrange.
    const key = createGuid();
    const target = createTestTarget();
    // Act.
    const actual = await target.read(key);
    // Assert.
    expect(actual).toBeNull();
  };

  const shouldInsertTheDataIfItDoesNotExist = async (createTestTarget: () => IZDatabaseMemory) => {
    // Arrange.
    const key = createGuid();
    const expected = { data: 'My-Data' };
    const target = createTestTarget();
    // Act.
    await target.upsert(key, expected);
    const actual = await target.read(key);
    // Assert.
    expect(actual).toEqual(expected);
  };

  const shouldReturnTheDataThatWasJustUpdated = async (createTestTarget: () => IZDatabaseMemory) => {
    // Arrange.
    const key = createGuid();
    const expected = { data: 'My-Data' };
    const target = createTestTarget();
    // Act.
    await target.upsert(key, 'some-data');
    const actual = await target.upsert(key, expected);
    // Assert.
    expect(actual).toEqual(expected);
  };

  const shouldUpdateTheDataInPlace = async (createTestTarget: () => IZDatabaseMemory) => {
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
  };

  const shouldDeleteKey = async (createTestTarget: () => IZDatabaseMemory) => {
    // Arrange.
    const key = createGuid();
    const target = createTestTarget();
    await target.upsert(key, 'data');
    // Act.
    await target.delete(key);
    const actual = await target.read(key);
    // Assert.
    expect(actual).toBeNull();
  };

  const shouldDeleteAllKeys = async (createTestTarget: () => IZDatabaseMemory) => {
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
  };

  describe('Local', () => {
    const createTestTarget = () => new ZDatabaseStorage(localStorage);

    beforeEach(async () => {
      await new ZDatabaseStorage(localStorage).delete();
    });

    describe('Read', () => {
      it('should insert the key if the key does not exist and the fallback is set', async () => {
        await shouldInsertTheKeyIfTheKeyDoesNotExistAndTheFallbackIsSet(createTestTarget);
      });

      it('should return null if the key does not exist and no fallback is set', async () => {
        await shouldReturnNullIfTheKeyDoesNotExistAndTheFallbackIsNotSet(createTestTarget);
      });

      it('should return the fallback if the key does not exist and the fallback is set', async () => {
        await shouldReturnTheFallbackIfTheKeyIsNotSet(createTestTarget);
      });
    });

    describe('Upsert', () => {
      it('should return the data that was just updated', async () => {
        await shouldReturnTheDataThatWasJustUpdated(createTestTarget);
      });

      it('should insert the data if the data does not exist', async () => {
        await shouldInsertTheDataIfItDoesNotExist(createTestTarget);
      });

      it('should update the data in place', async () => {
        await shouldUpdateTheDataInPlace(createTestTarget);
      });
    });

    describe('Delete', () => {
      it('should delete a key value', async () => {
        await shouldDeleteKey(createTestTarget);
      });

      it('should delete all keys', async () => {
        await shouldDeleteAllKeys(createTestTarget);
      });
    });
  });

  describe('Session', () => {
    const createTestTarget = () => new ZDatabaseStorage(sessionStorage);

    beforeEach(async () => {
      await new ZDatabaseStorage(sessionStorage).delete();
    });

    describe('Read', () => {
      it('should insert the key if the key does not exist and the fallback is set', async () => {
        await shouldInsertTheKeyIfTheKeyDoesNotExistAndTheFallbackIsSet(createTestTarget);
      });

      it('should return null if the key does not exist and no fallback is set', async () => {
        await shouldReturnNullIfTheKeyDoesNotExistAndTheFallbackIsNotSet(createTestTarget);
      });

      it('should return the fallback if the key does not exist and the fallback is set', async () => {
        await shouldReturnTheFallbackIfTheKeyIsNotSet(createTestTarget);
      });
    });

    describe('Upsert', () => {
      it('should return the data that was just updated', async () => {
        await shouldReturnTheDataThatWasJustUpdated(createTestTarget);
      });

      it('should insert the data if the data does not exist', async () => {
        await shouldInsertTheDataIfItDoesNotExist(createTestTarget);
      });

      it('should update the data in place', async () => {
        await shouldUpdateTheDataInPlace(createTestTarget);
      });
    });

    describe('Delete', () => {
      it('should delete a key value', async () => {
        await shouldDeleteKey(createTestTarget);
      });

      it('should delete all keys', async () => {
        await shouldDeleteAllKeys(createTestTarget);
      });
    });
  });
});
