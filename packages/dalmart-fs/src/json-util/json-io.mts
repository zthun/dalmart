import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname } from 'node:path';

export function tryReadJson<T = unknown>(url: string): T {
  try {
    // We have to use sync file reads to make sure that concurrent reads are
    // synchronized.
    const buffer = readFileSync(url);
    return JSON.parse(buffer.toString());
  } catch (_) {
    return {} as T;
  }
}

export function writeJson<T = unknown>(content: T, url: string): void {
  const dir = dirname(url);
  mkdirSync(dir, { recursive: true });
  const data = JSON.stringify(content, undefined, 2);
  writeFileSync(url, data, { flag: 'w+' });
}
