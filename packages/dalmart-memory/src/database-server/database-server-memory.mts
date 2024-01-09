import { IZDatabaseMemory } from '@zthun/dalmart-db';
import { ZDatabaseStorage } from '@zthun/dalmart-storage';
import { IZDatabaseServer } from './database-server.mjs';

/**
 * Represents a server for a memory database.
 */
export class ZDatabaseServerMemory implements Storage, IZDatabaseServer<IZDatabaseMemory> {
  private _dictionary: Record<string, string> = {};

  public get length() {
    return Object.keys(this._dictionary).length;
  }

  public clear(): void {
    this._dictionary = {};
  }

  public getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this._dictionary, key) ? this._dictionary[key] : null;
  }

  public key(index: number): string | null {
    const keys = Object.keys(this._dictionary);
    return index < keys.length ? keys[index] : null;
  }

  public removeItem(key: string): void {
    delete this._dictionary[key];
  }

  public setItem(key: string, value: string): void {
    this._dictionary[key] = value;
  }

  public running(): Promise<boolean> {
    return Promise.resolve(true);
  }

  public start(): Promise<IZDatabaseMemory> {
    return Promise.resolve(new ZDatabaseStorage(this));
  }

  public stop(): Promise<boolean> {
    return Promise.resolve(false);
  }
}
