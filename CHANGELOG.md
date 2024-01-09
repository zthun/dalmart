# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [1.3.0](https://github.com/zthun/dalmart/compare/v1.2.0...v1.3.0) (2024-01-09)


### Features

* dalmart-fs supports apis for databases using the file system ([0c99cf2](https://github.com/zthun/dalmart/commit/0c99cf264ab90bbe63ab7128db67480c75c62d8d))
* database json folder allows a document database api around a set of folder collections ([d84ff9a](https://github.com/zthun/dalmart/commit/d84ff9a73aad5c46c2e092330ceca47420031de0))
* json file is a memory database held in a single json file ([d883f47](https://github.com/zthun/dalmart/commit/d883f4772fac8fb6e32558cb05d82122cf949efa))
* note that outer joins with file system documents is currently not supported ([6157923](https://github.com/zthun/dalmart/commit/6157923f74f0c4ca6c6a410c51eb3ac59691805c))


### Bug Fixes

* redis upgrade to 4.6.12 ([2093bd8](https://github.com/zthun/dalmart/commit/2093bd82032f29886a47d963ceaa743435c95439))
* upgrade mongo-memory-db to 9.1.4 ([cef7fc5](https://github.com/zthun/dalmart/commit/cef7fc50d1a6f0c92086343689f0418938fd4a49))



## [1.2.0](https://github.com/zthun/dalmart/compare/v1.1.1...v1.2.0) (2023-12-06)


### Features

* dalmart web showcases the documentation for dalmart ([93d30fb](https://github.com/zthun/dalmart/commit/93d30fb9998774a3d51ba316d366b7f7e47aff27))
* redis to 4.6.11 ([9a04463](https://github.com/zthun/dalmart/commit/9a044630d0c6855b28457ef44e733223bf53e2ba))
* upgrade mongo driver to 6.x ([954d28d](https://github.com/zthun/dalmart/commit/954d28d62989f5e428eb68ebd5058799835a7743))



## [1.1.1](https://github.com/zthun/dalmart/compare/v1.1.0...v1.1.1) (2023-08-20)


### Bug Fixes

* count returns 0 if the collection does not exist ([596557c](https://github.com/zthun/dalmart/commit/596557ce85c55b4091f0fd1cd3fff1325241ad02))



## [1.1.0](https://github.com/zthun/dalmart/compare/v1.0.3...v1.1.0) (2023-08-20)


### Features

* document databases now support left outer joins ([68341d5](https://github.com/zthun/dalmart/commit/68341d57c709ad7b341d6ad5157785775915a6f9))
* you can now left outer join documents ([4fda6cd](https://github.com/zthun/dalmart/commit/4fda6cd14e979df8c3b902a2a0636ed99c33632c))



## [1.0.3](https://github.com/zthun/dalmart/compare/v1.0.2...v1.0.3) (2023-08-17)

**Note:** Version bump only for package @zthun/dalmart





## [1.0.2](https://github.com/zthun/dalmart/compare/v1.0.1...v1.0.2) (2023-08-16)


### Bug Fixes

* create returns empty for an empty list ([918bee0](https://github.com/zthun/dalmart/commit/918bee052c4314c62ba8a657f6136e16a54158de))



## [1.0.1](https://github.com/zthun/dalmart/compare/v0.1.2...v1.0.1) (2023-08-15)


### Bug Fixes

* helpful fn should no longer bundle uuid ([0b43f83](https://github.com/zthun/dalmart/commit/0b43f831c5cd423ecc6147f5030f15636906ab13))



## [0.1.2](https://github.com/zthun/dalmart/compare/v0.1.1...v0.1.2) (2023-08-12)

**Note:** Version bump only for package @zthun/dalmart





## [0.1.1](https://github.com/zthun/dalmart/compare/v0.1.0...v0.1.1) (2023-08-12)


### Bug Fixes

* optional options when creating a in memory document database ([1518b6e](https://github.com/zthun/dalmart/commit/1518b6e90a6de6519316e1dda1ec0fa255f220e0))



## 0.1.0 (2023-08-12)


### Features

* database name is now optional ([3409496](https://github.com/zthun/dalmart/commit/3409496491468fb08715535514240c61f8ee44bc))
* forage database for support with index db and web sql ([1ab5657](https://github.com/zthun/dalmart/commit/1ab56578565523eab81fc16ba1f018b71df96ef4))
* local storage and session storage implementations ([31831d4](https://github.com/zthun/dalmart/commit/31831d49697db677bbb63eaa65e530cca825a328))
* memory database for testing ([b2aff17](https://github.com/zthun/dalmart/commit/b2aff17b2f7247815886abd246b1a8d789c9b1e9))
* memory database is a key value database ([8995545](https://github.com/zthun/dalmart/commit/899554526cf71543d6ddd1acdd126dfd508e6041))
* redis connection ([430ca32](https://github.com/zthun/dalmart/commit/430ca324480863f7f5f5b752feb1b294206300be))
* support for mongodb ([ffd3759](https://github.com/zthun/dalmart/commit/ffd37592ab88d2b44c373cee2c3ba52af8a82164))
