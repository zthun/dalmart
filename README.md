# Dalmart

Object-relational mappers (ORMs) are a popular way to work with database
entities. Depending on the data model, however, they can produce inefficient
queries. Unnecessary joins, over-fetching, and transient fields can make data
access more complicated than it needs to be.

I wanted something simpler: a data access layer that sits between an ORM and
stored procedures, with the flexibility to query data as needed without defining
a large model schema.

Dalmart provides common interfaces for document and key-value databases.
Document operations support bulk inserts, filtered updates and deletes, sorting,
and pagination. Key-value operations support reading, upserting, and deleting
values. Implementations share these interfaces, although backend capabilities
differ.

## Packages

| Package                                                      | Purpose                                          |
| ------------------------------------------------------------ | ------------------------------------------------ |
| [@zthun/dalmart-db](packages/dalmart-db/README.md)           | Common database interfaces and options builders. |
| [@zthun/dalmart-mongo](packages/dalmart-mongo/README.md)     | MongoDB document database.                       |
| [@zthun/dalmart-redis](packages/dalmart-redis/README.md)     | Redis key-value database.                        |
| [@zthun/dalmart-fs](packages/dalmart-fs/README.md)           | JSON file and folder databases.                  |
| [@zthun/dalmart-storage](packages/dalmart-storage/README.md) | Browser local and session storage.               |
| [@zthun/dalmart-forage](packages/dalmart-forage/README.md)   | Browser storage through localForage.             |
| [@zthun/dalmart-memory](packages/dalmart-memory/README.md)   | Database servers for testing.                    |

Relational databases are not currently supported.
