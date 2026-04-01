import { rm } from "node:fs/promises";
import { resolve } from "node:path";

import type { IZDatabaseOptions } from "@zthun/dalmart-db";
import { ZDatabaseOptionsBuilder } from "@zthun/dalmart-db";
import type { IZBrand } from "@zthun/helpful-brands";
import { ZBrandKnown } from "@zthun/helpful-brands";
import { createGuid } from "@zthun/helpful-fn";
import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { ZDatabaseJsonFile } from "./database-json-file.mjs";

describe("ZDatabaseJsonContent", () => {
  const tempDir = resolve(__dirname, "../../.temp");
  let options: IZDatabaseOptions;

  const createTestTarget = () => {
    return new ZDatabaseJsonFile(options);
  };

  afterAll(async () => {
    await rm(tempDir, { recursive: true, force: true }).catch(() => true);
  });

  describe("Read", () => {
    beforeEach(() => {
      const path = resolve(__dirname, "../../.test/brands/meta/facebook.json");
      options = new ZDatabaseOptionsBuilder().url(path).build();
    });

    it("should read a json content as a single object with the key as a key into the document", async () => {
      // Arrange.
      const target = createTestTarget();
      const expected = ZBrandKnown.facebook();
      // Act.
      const actual = await target.read("name");
      // Assert.
      expect(actual).toEqual(expected.name);
    });

    it("should return a fallback for a key that does not exist", async () => {
      // Arrange.
      const target = createTestTarget();
      const expected = "i-am-the-fallback";
      // Act.
      const actual = await target.read("i-do-not-exist", expected);
      // Assert.
      expect(actual).toEqual(expected);
    });

    it("should return a fallback for a file that does not exist", async () => {
      // Arrange.
      options = new ZDatabaseOptionsBuilder()
        .url("/path/to/nothing.json")
        .build();
      const expected = "i-am-the-fallback";
      const target = createTestTarget();
      // Act.
      const actual = await target.read("name", expected);
      // Assert.
      expect(actual).toEqual(expected);
    });

    it("should reject if the url is not set in the options", async () => {
      // Arrange.
      options = new ZDatabaseOptionsBuilder().build();
      const target = createTestTarget();
      // Act.
      const actual = target.read("id");
      // Assert.
      await expect(actual).rejects.toBeTruthy();
    });
  });

  describe("Write", () => {
    let linkedin: IZBrand;

    beforeEach(() => {
      linkedin = ZBrandKnown.linkedin();
      const path = resolve(tempDir, createGuid(), "linkedin.json");
      options = new ZDatabaseOptionsBuilder().url(path).build();
    });

    it("should add the specific key to the file and save it.", async () => {
      // Arrange.
      const target = createTestTarget();
      // Act.
      const keys = Object.keys(linkedin);
      await Promise.all(keys.map((k) => target.upsert(k, linkedin[k])));
      const actual = ZBrandKnown.linkedin();
      actual.id = await target.read("id", "");
      actual.name = await target.read("name", "");
      actual.founded = await target.read("founded", "Invalid Date");
      // Assert.
      expect(actual).toEqual(linkedin);
    });

    it("should delete the key from a file", async () => {
      // Arrange.
      const target = createTestTarget();
      await target.upsert("name", linkedin.name);
      // Act.
      await target.delete("name");
      const actual = await target.read("name");
      // Assert.
      expect(actual).toBeNull();
    });

    it("should delete all keys from a file", async () => {
      // Arrange.
      const target = createTestTarget();
      await target.upsert("id", linkedin.id);
      await target.upsert("name", linkedin.name);
      // Act.
      await target.delete();
      const values = await Promise.all([
        target.read("_id"),
        target.read("name"),
        target.read("alias"),
      ]);
      const actual = values.every((v) => v == null);
      // Assert.
      expect(actual).toBeTruthy();
    });
  });
});
