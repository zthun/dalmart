import { IZDataRequest, IZFilter } from '@zthun/helpful-query';
import { IZDatabaseDocumentCollection } from './database-document-collection';

/**
 * Represents a set of database operations for a document database.
 */
export interface IZDatabaseDocument {
  /**
   * Retrieves the count of documents from the source.
   *
   * @param source -
   *        The source collection to count.
   * @param scope -
   *        The data scope.  If this is undefined,
   *        then the total number of documents in the database
   *        should be returned.
   *
   * @returns
   *        The total source count.
   */
  count(source: string | IZDatabaseDocumentCollection, scope?: IZFilter): Promise<number>;

  /**
   * Inserts many documents in the database.
   *
   * @param source -
   *        The source to create into.
   * @param template -
   *        The template documents.
   *
   * @returns
   *        A list of matching documents that have been inserted into the database.
   */
  create<T>(source: string, template: T[]): Promise<T[]>;

  /**
   * Updates fields in the database.
   *
   * @param source -
   *        The source to update.
   * @param template -
   *        The partial template that contains the fields to update.
   * @param scope -
   *        The scope to filter to.  If this is undefined, then all documents
   *        are updated.
   *
   * @returns
   *        The total number of documents updated.
   */
  update<T>(source: string, template: Partial<T>, scope?: IZFilter): Promise<number>;

  /**
   * Reads documents from the database.
   *
   * @param source -
   *        The source collection to read from.
   * @param request -
   *        The request scope.  If this is undefined,
   *        then all documents are read from the database.
   *
   * @returns
   *        A page of documents that match the request scope.
   */
  read<T>(source: string | IZDatabaseDocumentCollection, request?: IZDataRequest): Promise<T[]>;

  /**
   * Deletes documents from the database.
   *
   * @param source -
   *        The source to delete from.
   * @param scope -
   *        The scope of data to delete.
   *
   * @returns
   *        The total number of documents deleted.
   */
  delete(source: string, scope?: IZFilter): Promise<number>;
}
