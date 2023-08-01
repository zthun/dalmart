import { describe, expect, it } from 'vitest';
import { ZDatabaseOptionsBuilder } from './database-options';

describe('ZDatabaseOptionsBuilder', () => {
  function createTestTarget() {
    return new ZDatabaseOptionsBuilder();
  }

  describe('Properties', () => {
    it('sets the database.', () => {
      const expected = 'database';
      expect(createTestTarget().database(expected).build().database).toEqual(expected);
    });

    it('sets the URL.', () => {
      const expected = 'mongodb://database.zthunworks.com';
      expect(createTestTarget().url(expected).build().url).toEqual(expected);
    });
  });

  describe('Copy', () => {
    it('copies all properties.', () => {
      const expected = createTestTarget()
        .database('database')
        .url('mongodb://database.zthunworks.com')
        .timeout(500)
        .build();
      const actual = createTestTarget().copy(expected).build();
      expect(actual).toEqual(expected);
    });
  });

  describe('Assign', () => {
    it('updates properties in the builder.', () => {
      const url = 'mongodb://database.zthunworks.com';
      const database = 'database';
      const expected = createTestTarget().database('database').url(url).build();
      const actual = createTestTarget().assign({ database, url }).build();
      expect(actual).toEqual(expected);
    });
  });
});
