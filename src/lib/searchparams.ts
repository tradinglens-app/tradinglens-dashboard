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
  username: parseAsString,
  email: parseAsString,
  date: parseAsArrayOf(parseAsInteger).withDefault([]),
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
  created_at: parseAsArrayOf(parseAsInteger).withDefault([]),
  isActive: parseAsArrayOf(parseAsString).withDefault([]),
  q: parseAsString.withDefault(''),
  search: parseAsString.withDefault(''),
  title_en: parseAsString.withDefault(''),
  title_th: parseAsString.withDefault(''),
  description_en: parseAsString.withDefault(''),
  description_th: parseAsString.withDefault(''),
  id: parseAsString.withDefault(''),
  topic: parseAsString.withDefault(''),
  postTitle: parseAsString.withDefault(''),
  content: parseAsString.withDefault(''),
  accountStatus: parseAsArrayOf(parseAsString).withDefault([]),
  visibility: parseAsArrayOf(parseAsString).withDefault([])
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
