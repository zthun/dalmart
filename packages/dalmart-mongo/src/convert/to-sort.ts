import { IZSort, ZSortDirection } from '@zthun/helpful-query';

export function toDir(dir: ZSortDirection) {
  return dir === ZSortDirection.Ascending ? 1 : -1;
}

export function toSort(sort: IZSort[]) {
  const sorting = {};
  sort.forEach((srt) => (sorting[srt.subject!] = toDir(srt.direction)));
  return sorting;
}
