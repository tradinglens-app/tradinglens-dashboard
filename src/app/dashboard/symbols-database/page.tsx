import PageContainer from '@/components/layout/page-container';
import { searchParamsCache } from '@/lib/searchparams';
import {
  getSymbols,
  getSymbolEnumValues
} from '@/features/symbols/services/symbol.service';
import { SymbolListing } from '@/features/symbols/components/symbol-tables';
import { Card, CardContent } from '@/components/ui/card';

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

  const [{ data, totalCount }, enumValues] = await Promise.all([
    getSymbols({
      page,
      pageSize,
      search: search || undefined,
      type,
      exchange: exchange || undefined,
      createdAt: createdAt || undefined
    }),
    getSymbolEnumValues()
  ]);

  return (
    <PageContainer
      scrollable={false}
      pageTitle='Symbols Database'
      pageDescription='Manage symbols and assets'
    >
      <div className='flex flex-1 flex-col gap-4'>
        <Card className='flex flex-1 flex-col'>
          <CardContent className='flex flex-1 flex-col p-6'>
            <SymbolListing
              data={data}
              totalCount={totalCount}
              enumValues={enumValues}
            />
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
