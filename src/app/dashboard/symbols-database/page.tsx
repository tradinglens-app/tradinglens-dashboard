import PageContainer from '@/components/layout/page-container';
import { searchParamsCache } from '@/lib/searchparams';
import { getSymbols } from '@/features/symbols/services/symbol.service';
import { SymbolListing } from '@/features/symbols/components/symbol-listing';
import { AddSymbolTrigger } from '@/features/symbols/components/add-symbol-trigger';

export default async function SymbolsDatabasePage({
  searchParams
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;
  searchParamsCache.parse(params);

  const page = searchParamsCache.get('page');
  const search = searchParamsCache.get('name'); // Using 'name' as searchKey in Listing
  const type = searchParamsCache.get('type');
  const exchange = searchParamsCache.get('exchange');
  const pageSize = searchParamsCache.get('perPage');
  const createdAt = searchParamsCache.get('createdAt');

  const { data, totalCount } = await getSymbols({
    page,
    pageSize,
    search: search || undefined,
    type: type || undefined,
    exchange: exchange || undefined,
    createdAt: createdAt || undefined
  });

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Symbols Database'
      pageDescription='Manage symbols and assets'
    >
      <div className='flex flex-1 flex-col gap-4'>
        <SymbolListing data={data} totalCount={totalCount} />
      </div>
    </PageContainer>
  );
}
