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

const BinaryMap: Record<ZOperatorBinary, (v: any) => object> = {
  [ZOperatorBinary.Equal]: (v: any) => ({ $eq: v }),
  [ZOperatorBinary.NotEqual]: (v: any) => ({ $ne: v }),
  [ZOperatorBinary.GreaterThan]: (v: any) => ({ $gt: v }),
  [ZOperatorBinary.GreaterThanEqualTo]: (v: any) => ({ $gte: v }),
  [ZOperatorBinary.LessThan]: (v: any) => ({ $lt: v }),
  [ZOperatorBinary.LessThanEqualTo]: (v: any) => ({ $lte: v }),
  [ZOperatorBinary.Like]: (v: any) => ({ $regex: v, $options: 'i' })
};

const CollectionMap: Record<ZOperatorCollection, (v: any[]) => object> = {
  [ZOperatorCollection.In]: (v: any[]) => ({ $in: v }),
  [ZOperatorCollection.NotIn]: (v: any[]) => ({ $nin: v })
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
    _filter[filter.subject] = BinaryMap[filter.operator](filter.value);
  }

  if (isCollectionFilter(filter)) {
    _filter[filter.subject] = CollectionMap[filter.operator](filter.values);
  }

  if (isUnaryFilter(filter)) {
    _filter[filter.subject] = { $exists: UnaryMap[filter.operator] };
  }

  return _filter;
}
