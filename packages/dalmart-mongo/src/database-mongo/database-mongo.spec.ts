import { IZDatabaseOptions, ZDatabaseDocumentCollectionBuilder, ZDatabaseOptionsBuilder } from '@zthun/dalmart-db';
import { createGuid } from '@zthun/helpful-fn';
import {
  IZFilter,
  ZDataRequestBuilder,
  ZFilterBinaryBuilder,
  ZFilterCollectionBuilder,
  ZFilterLogicBuilder,
  ZFilterUnaryBuilder,
  ZSortBuilder
} from '@zthun/helpful-query';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { ZDatabaseMongo } from './database-mongo.mjs';

describe('ZDatabaseMongo', () => {
  const database = 'test-db';

  let server: MongoMemoryServer;
  let options: IZDatabaseOptions;
  let url: string;

  beforeAll(async () => {
    server = new MongoMemoryServer();
    await server.start();

    const { ip, port } = server.instanceInfo!;
    url = `mongodb://${ip}:${port}`;
    options = new ZDatabaseOptionsBuilder().url(url).database(database).build();
  });

  afterAll(async () => {
    await server.stop();
  });

  function createTestTarget(): ZDatabaseMongo {
    return new ZDatabaseMongo(options);
  }

  function createBadHostTestTarget(): ZDatabaseMongo {
    const _options = new ZDatabaseOptionsBuilder().copy(options).url('mongodb://bad-host:1111').timeout(100).build();
    return new ZDatabaseMongo(_options);
  }

  describe('Connection', () => {
    function assertConnection<T>(expected: T, targetFn: () => ZDatabaseMongo, connectionFn: (t: ZDatabaseMongo) => T) {
      // Arrange
      const target = targetFn();
      // Act
      const actual = connectionFn(target);
      // Assert
      expect(actual).toEqual(expected);
    }

    function assertDefault(targetFn: () => ZDatabaseMongo, propFn: (t: ZDatabaseMongo) => any) {
      // Arrange
      const target = targetFn();
      // Act
      const actual = propFn(target);
      // Assert
      expect(actual).toBeTruthy();
    }

    it('sets the options.', () => {
      assertConnection(
        options,
        () => createTestTarget(),
        (t) => t.$options
      );
    });

    it('sets the correct database.', () => {
      assertConnection(
        database,
        () => createTestTarget(),
        (t) => t.$database
      );
    });

    it('sets the correct url.', () => {
      assertConnection(
        url,
        () => createTestTarget(),
        (t) => t.$url
      );
    });

    it('defaults the url.', () => {
      assertDefault(
        () => new ZDatabaseMongo(new ZDatabaseOptionsBuilder().build()),
        (t) => t.$url
      );
    });

    it('defaults the database.', () => {
      assertDefault(
        () => new ZDatabaseMongo(new ZDatabaseOptionsBuilder().build()),
        (t) => t.$database
      );
    });
  });

  describe('CRUD', () => {
    let fred: any;
    let barney: any;
    let wilma: any;
    let betty: any;
    let parents: any[];
    let parentsSource: string;
    let bamBam: any;
    let pebbles: any;
    let kids: any;
    let kidsSource: string;

    async function createPopulatedTarget() {
      const target = createTestTarget();
      await target.delete(parentsSource);
      await target.delete(kidsSource);
      await target.create(parentsSource, parents);
      await target.create(kidsSource, kids);
      return target;
    }

    beforeEach(async () => {
      fred = {
        _id: createGuid(),
        name: 'Fred',
        rating: 5,
        flintstone: true
      };
      barney = {
        _id: createGuid(),
        name: 'Barney',
        rating: 4.2
      };
      wilma = {
        _id: createGuid(),
        name: 'Wilma',
        rating: 3.7,
        flintstone: true
      };
      betty = {
        _id: createGuid(),
        name: 'Betty',
        rating: 2.8
      };

      bamBam = {
        _id: createGuid(),
        fatherId: barney._id,
        motherId: betty._id,
        name: 'BamBam'
      };

      pebbles = {
        _id: createGuid(),
        fatherId: fred._id,
        motherId: wilma._id,
        name: 'Pebbles'
      };

      parentsSource = 'flintstones-parents';
      parents = [fred, barney, wilma, betty];
      kidsSource = 'flintstones-kids';
      kids = [bamBam, pebbles];
    });

    describe('Aggregate', () => {
      describe('Count', async () => {
        it('returns 0 if the collection does not exist', async () => {
          // Arrange.
          const target = createTestTarget();
          // Act.
          const actual = await target.count('lol-wut');
          // Assert.
          expect(actual).toEqual(0);
        });

        it('returns the total number of items in the collection', async () => {
          // Arrange.
          const target = await createPopulatedTarget();
          // Act.
          const actual = await target.count(parentsSource);
          // Assert.
          expect(actual).toEqual(parents.length);
        });

        it('returns the total number of items restricted with a filter', async () => {
          // Arrange.
          const target = await createPopulatedTarget();
          const filter = new ZFilterBinaryBuilder().subject('name').like().value('Fred').build();
          // Act.
          const actual = await target.count(parentsSource, filter);
          // Assert.
          expect(actual).toEqual(1);
        });
      });
    });

    describe('Create', () => {
      it('returns empty if the empty list is passed', async () => {
        // Arrange.
        const target = createTestTarget();
        // Act.
        const actual = await target.create(parentsSource, []);
        // Assert.
        expect(actual).toEqual([]);
      });

      it('adds one item to the database.', async () => {
        // Arrange
        const target = createTestTarget();
        // Act
        const actual = await target.create(parentsSource, [fred]);
        // Assert
        expect(actual.length).toEqual(1);
        expect(actual[0]._id).toEqual(fred._id);
        expect(actual[0].name).toEqual(fred.name);
      });

      it('adds all items to the database.', async () => {
        // Arrange
        const cmp = (x, y) => (x < y ? -1 : x > y ? 1 : 0);
        const target = createTestTarget();
        const expected = parents.map((p) => p.name);
        expected.sort(cmp);
        // Act
        const actual = await target.create(parentsSource, parents);
        const names = actual.map((p) => p.name);
        names.sort(cmp);
        // Assert
        expect(names).toEqual(expected);
      });

      it('constructs ids for all documents that do not have the _id field set.', async () => {
        // Arrange
        const target = createTestTarget();
        delete fred._id;
        delete wilma._id;
        // Act
        const actual = await target.create(parentsSource, parents);
        // Assert
        actual.forEach((doc) => expect(typeof doc._id).toEqual('string'));
      });

      it('rejects if a connection cannot be established.', async () => {
        // Arrange
        const target = createBadHostTestTarget();
        // Act
        const query = target.create(parentsSource, parents);
        // Assert
        await expect(query).rejects.toBeTruthy();
      });
    });

    describe('Read', () => {
      it('reads all data.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        const actual = await target.read(parentsSource);
        // Assert
        expect(actual).toEqual(parents);
      });

      it('sorts the data in ascending order.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        const expected = parents.sort((a, b) => (a.name < b.name ? -1 : a.name > b.name ? 1 : 0));
        const sorted = new ZSortBuilder().ascending('name').build();
        // Act
        const actual = await target.read(parentsSource, new ZDataRequestBuilder().sort(sorted).build());
        // Assert
        expect(actual).toEqual(expected);
      });

      it('sorts the data in descending order.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        const expected = parents.sort((a, b) => (a.name < b.name ? 1 : a.name > b.name ? -1 : 0));
        const sorted = new ZSortBuilder().descending('name').build();
        // Act
        const actual = await target.read(parentsSource, new ZDataRequestBuilder().sort(sorted).build());
        // Assert
        expect(actual).toEqual(expected);
      });

      it('returns page data.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        const actual = await target.read(parentsSource, new ZDataRequestBuilder().size(2).build());
        // Assert
        expect(actual).toEqual([fred, barney]);
      });

      it('returns the correct page.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        const actual = await target.read(parentsSource, new ZDataRequestBuilder().page(2).size(2).build());
        // Assert
        expect(actual).toEqual([wilma, betty]);
      });

      it('returns the empty array if retrieving any pages beyond the last.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        const actual = await target.read(parentsSource, new ZDataRequestBuilder().page(2).size(parents.length).build());
        // Assert
        expect(actual).toEqual([]);
      });

      it('returns the remaining items on the last page.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        const actual = await target.read(parentsSource, new ZDataRequestBuilder().page(2).size(3).build());
        // Assert
        expect(actual).toEqual([betty]);
      });

      it('rejects if a connection cannot be established.', async () => {
        // Arrange
        const target = createBadHostTestTarget();
        // Act
        const query = target.read(parentsSource);
        // Assert
        await expect(query).rejects.toBeTruthy();
      });

      describe('Join', () => {
        it('should join the appropriate data', async () => {
          // Arrange.
          const target = await createPopulatedTarget();
          const collection = new ZDatabaseDocumentCollectionBuilder(kidsSource)
            .join(parentsSource, 'motherId', '_id', 'mother')
            .join(parentsSource, 'fatherId', '_id', 'father')
            .build();
          const request = new ZDataRequestBuilder()
            .filter(new ZFilterBinaryBuilder().subject('_id').equal().value(bamBam._id).build())
            .build();
          // Act.
          const [_bamBam] = await target.read<any>(collection, request);
          const [mother] = _bamBam.mother;
          const [father] = _bamBam.father;
          // Assert.
          expect(mother).toEqual(betty);
          expect(father).toEqual(barney);
        });
      });

      describe('Filter', () => {
        const shouldReturnExpectedData = async (expected: any[], filter: IZFilter) => {
          // Arrange
          const target = await createPopulatedTarget();
          // Act
          const actual = await target.read(parentsSource, new ZDataRequestBuilder().filter(filter).build());
          // Assert
          expect(actual).toEqual(expected);
        };

        describe('Logic', () => {
          describe('And', () => {
            it('returns expected data', async () => {
              const a = new ZFilterBinaryBuilder().subject('rating').greaterThan().value(3).build();
              const b = new ZFilterBinaryBuilder().subject('rating').lessThan().value(5).build();
              const filter = new ZFilterLogicBuilder().and().clause(a).clause(b).build();
              await shouldReturnExpectedData([barney, wilma], filter);
            });
          });

          describe('Or', () => {
            it('returns expected data', async () => {
              const a = new ZFilterBinaryBuilder().subject('name').equal().value('Fred').build();
              const b = new ZFilterBinaryBuilder().subject('name').equal().value('Wilma').build();
              const filter = new ZFilterLogicBuilder().or().clause(a).clause(b).build();
              await shouldReturnExpectedData([fred, wilma], filter);
            });
          });
        });

        describe('Binary', () => {
          describe('Equals', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterBinaryBuilder().subject('name').equal().value(fred.name).build();
              await shouldReturnExpectedData([fred], filter);
            });
          });

          describe('Not Equals', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterBinaryBuilder().subject('name').notEqual().value(fred.name).build();
              await shouldReturnExpectedData([barney, wilma, betty], filter);
            });
          });

          describe('Less Than', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterBinaryBuilder().subject('rating').lessThan().value(4.2).build();
              await shouldReturnExpectedData([wilma, betty], filter);
            });
          });

          describe('Less Than Equal To', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterBinaryBuilder().subject('rating').lessThanEqualTo().value(4.2).build();
              await shouldReturnExpectedData([barney, wilma, betty], filter);
            });
          });

          describe('Greater Than', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterBinaryBuilder().subject('rating').greaterThan().value(3.7).build();
              await shouldReturnExpectedData([fred, barney], filter);
            });
          });

          describe('Greater Than Equal To', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterBinaryBuilder().subject('rating').greaterThanEqualTo().value(3.7).build();
              await shouldReturnExpectedData([fred, barney, wilma], filter);
            });
          });

          describe('Like', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterBinaryBuilder().subject('name').like().value('bar.').build();
              await shouldReturnExpectedData([barney], filter);
            });
          });
        });

        describe('Collection', () => {
          describe('In', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterCollectionBuilder()
                .subject('name')
                .in()
                .value(fred.name)
                .value(betty.name)
                .build();
              await shouldReturnExpectedData([fred, betty], filter);
            });
          });

          describe('Not In', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterCollectionBuilder()
                .subject('name')
                .notIn()
                .value(wilma.name)
                .value(barney.name)
                .build();
              await shouldReturnExpectedData([fred, betty], filter);
            });
          });
        });

        describe('Unary', () => {
          describe('Not Null', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterUnaryBuilder().subject('flintstone').isNotNull().build();
              await shouldReturnExpectedData([fred, wilma], filter);
            });
          });

          describe('Null', () => {
            it('returns expected data', async () => {
              const filter = new ZFilterUnaryBuilder().subject('flintstone').isNull().build();
              await shouldReturnExpectedData([barney, betty], filter);
            });
          });
        });
      });
    });

    describe('Update', () => {
      let template: any;

      beforeEach(() => {
        template = { name: 'Dino' };
      });

      it('updates all items that match the filter.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        const expected = [Object.assign({}, fred, template), Object.assign({}, barney, template), wilma, betty];
        // Act
        await target.update(
          parentsSource,
          template,
          new ZFilterCollectionBuilder().subject('name').in().value('Fred').value('Barney').build()
        );
        const actual = await target.read(parentsSource);
        // Assert
        expect(actual).toEqual(expected);
      });

      it('updates all items.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        const expected = parents.map((doc) => Object.assign({}, doc, template));
        // Act
        await target.update(parentsSource, template);
        const actual = await target.read(parentsSource);
        // Assert
        expect(actual).toEqual(expected);
      });

      it('returns the total number of items updated.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        const actual = await target.update(parentsSource, template);
        // Assert
        expect(actual).toEqual(parents.length);
      });

      it('rejects if a connection cannot be established.', async () => {
        // Arrange
        const target = createBadHostTestTarget();
        // Act
        const query = target.update(parentsSource, template);
        // Assert
        await expect(query).rejects.toBeTruthy();
      });
    });

    describe('Delete', () => {
      it('deletes one document.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        await target.delete(parentsSource, new ZFilterBinaryBuilder().subject('_id').equal().value(barney._id).build());
        const actual = await target.read(parentsSource);
        // Act
        expect(actual).toEqual([fred, wilma, betty]);
      });

      it('deletes multiple documents.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        await target.delete(
          parentsSource,
          new ZFilterCollectionBuilder().subject('_id').in().value(fred._id).value(barney._id).build()
        );
        const actual = await target.read(parentsSource);
        // Act
        expect(actual).toEqual([wilma, betty]);
      });

      it('deletes all documents.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        await target.delete(parentsSource);
        const actual = await target.read(parentsSource);
        // Assert
        expect(actual.length).toEqual(0);
      });

      it('returns the number of documents deleted.', async () => {
        // Arrange
        const target = await createPopulatedTarget();
        // Act
        const actual = await target.delete(parentsSource);
        // Assert
        expect(actual).toEqual(parents.length);
      });

      it('rejects if a connection cannot be established.', async () => {
        // Arrange
        const target = createBadHostTestTarget();
        // Act
        const query = target.delete(parentsSource);
        // Assert
        await expect(query).rejects.toBeTruthy();
      });
    });
  });
});
