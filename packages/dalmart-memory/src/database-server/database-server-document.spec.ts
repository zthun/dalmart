import { IZDatabaseDocument, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { identity, range } from 'lodash-es';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import { ZDatabaseServerDocument } from './database-server-document.mjs';
import { IZDatabaseServer } from './database-server.mjs';

describe('ZDocumentServer', () => {
  let _targets: IZDatabaseServer<IZDatabaseDocument>[];

  const createTestTarget = () => {
    const target = new ZDatabaseServerDocument();
    _targets.push(target);
    return target;
  };

  beforeEach(() => {
    _targets = [];
  });

  afterEach(async () => {
    await Promise.all(_targets.map((t) => t.stop()));
  });

  describe('Start', () => {
    it('should start the server', async () => {
      // Arrange.
      const target = createTestTarget();
      // Act.
      await target.start(new ZDatabaseOptionsBuilder().timeout(100).build());
      const actual = await target.running();
      // Assert.
      expect(actual).toBeTruthy();
    });

    it('should retain the same client if the server has already been started', async () => {
      // Arrange.
      const target = createTestTarget();
      const expected = await target.start();
      // Act.
      const actual = await target.start();
      // Assert.
      expect(actual).toBe(expected);
    });

    it('should try as many times as needed to start the server while ports get used', async () => {
      // Arrange.
      const targets = range(0, 20).map(() => createTestTarget());
      await Promise.all(targets.map((t) => t.start()));
      // Act.
      const running = await Promise.all(targets.map((t) => t.running()));
      const actual = running.every(identity);
      // Assert
      expect(actual).toBeTruthy();
    });
  });

  describe('Stop', () => {
    it('should stop a server', async () => {
      // Arrange.
      const target = createTestTarget();
      await target.start();
      // Act.
      await target.stop();
      const actual = await target.running();
      // Assert.
      expect(actual).toBeFalsy();
    });

    it('should return true if the server is already stopped', async () => {
      // Arrange.
      const target = createTestTarget();
      await target.start();
      // Act.
      await target.stop();
      const actual = await target.stop();
      // Assert.
      expect(actual).toBeTruthy();
    });
  });
});
