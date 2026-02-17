import {
  createSearchParamsCache,
  createSerializer,
  parseAsArrayOf,
  parseAsInteger,
  parseAsString
} from 'nuqs/server';
import { DEFAULT_PAGE_SIZE } from '@/constants/data-table-config';

export const searchParams = {
  page: parseAsInteger.withDefault(1),
  perPage: parseAsInteger.withDefault(DEFAULT_PAGE_SIZE),
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
  type: parseAsArrayOf(parseAsString).withDefault([]),
  post_type: parseAsArrayOf(parseAsString).withDefault([]),
  title: parseAsString.withDefault(''),
  symbol: parseAsString.withDefault(''),
  publisher: parseAsString.withDefault(''),
  createdAt: parseAsArrayOf(parseAsInteger).withDefault([]),
  publishedDate: parseAsArrayOf(parseAsInteger).withDefault([]),
  created_at: parseAsArrayOf(parseAsInteger).withDefault([]),
  start_at: parseAsArrayOf(parseAsInteger).withDefault([]),
  end_at: parseAsArrayOf(parseAsInteger).withDefault([]),
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
  visibility: parseAsArrayOf(parseAsString).withDefault([]),
  is_read: parseAsArrayOf(parseAsString).withDefault([]),
  hasImage: parseAsArrayOf(parseAsString).withDefault([]),
  hasLogo: parseAsArrayOf(parseAsString).withDefault([]),
  showDuplicates: parseAsArrayOf(parseAsString).withDefault([])
};

export const searchParamsCache = createSearchParamsCache(searchParams);
export const serialize = createSerializer(searchParams);
