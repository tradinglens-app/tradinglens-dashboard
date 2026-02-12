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
  sort: parseAsString.withDefault('[{"id":"createdAt","desc":true}]'),
  gender: parseAsString,
  category: parseAsString,
  exchange: parseAsString,
  type: parseAsString,
  title: parseAsString.withDefault(''),
  symbol: parseAsString.withDefault(''),
  publisher: parseAsString.withDefault(''),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  isActive: parseAsArrayOf(parseAsString).withDefault([])
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
