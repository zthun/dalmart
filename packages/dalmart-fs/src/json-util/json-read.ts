import { readFileSync } from 'node:fs';

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
