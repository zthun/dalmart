/**
 * Represents a collection of documents in a document db.
 */
export interface IZDatabaseDocumentCollection {
  /**
   * The collection name.
   */
  name: string;
  /**
   * A list of left outer join targets.
   */
  join: Array<{ target: string; local: string; foreign: string; as: string }>;
}

/**
 * A builder that builds a collection for a document database.
 */
export class ZDatabaseDocumentCollectionBuilder {
  private _collection: IZDatabaseDocumentCollection;

  /**
   * Initializes a new instance of this object.
   *
   * @param name -
   *        The name of the collection.
   */
  public constructor(name: string) {
    this._collection = {
      name,
      join: []
    };
  }

  /**
   * Adds a left outer join to the collection.
   *
   * @param target -
   *        The target collection to join against.
   * @param local -
   *        The local field to match on.
   * @param foreign -
   *        The foreign field to match the local to.
   * @param as -
   *        The output property.
   *
   * @returns
   *        This object.
   */
  public join(target: string, local: string, foreign: string, as: string) {
    this._collection.join = this._collection.join.concat({ target, local, foreign, as });
    return this;
  }

  /**
   * Returns the built collection.
   *
   * @returns
   *        The built collection.
   */
  public build() {
    return structuredClone(this._collection);
  }
}
