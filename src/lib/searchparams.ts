import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(10),
  name: parseAsString,
  userName: parseAsString,
  email: parseAsString,
  status: parseAsArrayOf(parseAsString),
  sort: parseAsString.withDefault('[{"id":"date","desc":true}]'),
  gender: parseAsString,
  category: parseAsString,
  exchange: parseAsString,
  type: parseAsString
  // advanced filter
  // filters: getFiltersStateParser().withDefault([]),
  // joinOperator: parseAsStringEnum(['and', 'or']).withDefault('and')
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
