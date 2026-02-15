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
  const symbolParam = searchParamsCache.get('symbol');
  const nameParam = searchParamsCache.get('name');
  // const search = nameParam || symbolParam;
  const type = searchParamsCache.get('type');
  const exchange = searchParamsCache.get('exchange');
  const pageSize = searchParamsCache.get('perPage');
  const createdAt = searchParamsCache.get('createdAt');
  const hasLogo = searchParamsCache.get('hasLogo');
  const sort = searchParamsCache.get('sort');

  const [{ data, totalCount }, enumValues] = await Promise.all([
    getSymbols({
      page,
      pageSize,
      name: nameParam || undefined,
      symbol: symbolParam || undefined,
      type,
      exchange: exchange || undefined,
      createdAt: createdAt || undefined,
      hasLogo: hasLogo || undefined,
      sort
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
