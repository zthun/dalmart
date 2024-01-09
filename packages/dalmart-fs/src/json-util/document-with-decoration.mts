export interface IZDocumentWithId {
  _id?: string;
}

export type ZDocumentWithDecoration<T> = T & IZDocumentWithId;
