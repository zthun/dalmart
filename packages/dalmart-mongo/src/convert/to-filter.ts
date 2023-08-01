import {
  IZFilter,
  ZOperatorBinary,
  ZOperatorCollection,
  ZOperatorLogic,
  ZOperatorUnary,
  isBinaryFilter,
  isCollectionFilter,
  isLogicFilter,
  isUnaryFilter
} from '@zthun/helpful-query';
import { Filter } from 'mongodb';

const LogicMap: Record<ZOperatorLogic, string> = {
  [ZOperatorLogic.And]: '$and',
  [ZOperatorLogic.Or]: '$or'
};

const BinaryMap: Record<ZOperatorBinary, string> = {
  [ZOperatorBinary.Equal]: '$eq',
  [ZOperatorBinary.NotEqual]: '$neq',
  [ZOperatorBinary.GreaterThan]: '$gt',
  [ZOperatorBinary.GreaterThanEqualTo]: '$gte',
  [ZOperatorBinary.LessThan]: '$lt',
  [ZOperatorBinary.LessThanEqualTo]: '$lte',
  [ZOperatorBinary.Like]: '$cn'
};

const CollectionMap: Record<ZOperatorCollection, string> = {
  [ZOperatorCollection.In]: '$in',
  [ZOperatorCollection.NotIn]: '$nin'
};

const UnaryMap: Record<ZOperatorUnary, boolean> = {
  [ZOperatorUnary.IsNull]: false,
  [ZOperatorUnary.IsNotNull]: true
};

export function toFilter(filter?: IZFilter): Filter<any> {
  const _filter = {};

  if (filter == null) {
    return _filter;
  }

  if (isLogicFilter(filter)) {
    _filter[LogicMap[filter.operator]] = filter.clauses.map((c) => toFilter(c));
  }

  if (isBinaryFilter(filter)) {
    _filter[filter.subject] = { [BinaryMap[filter.operator]]: filter.value };
  }

  if (isCollectionFilter(filter)) {
    _filter[filter.subject] = { [CollectionMap[filter.operator]]: filter.values };
  }

  if (isUnaryFilter(filter)) {
    _filter[filter.subject] = { $exists: UnaryMap[filter.operator] };
  }

  return _filter;
}
