'use client';

import { SymbolData } from '../services/symbol.service';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Building2, CalendarDays, Globe, Tag, Clock } from 'lucide-react';
import Image from 'next/image';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailInfoRow } from '@/components/ui/detail-info-row';

interface SymbolDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  symbol: SymbolData | null;
}

export function SymbolDetailSheet({
  isOpen,
  onClose,
  symbol
}: SymbolDetailSheetProps) {
  if (!symbol) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <DetailSheetHeader
            avatar={{
              src: symbol.logo || null,
              fallback: symbol.symbol.slice(0, 2)
            }}
            title={symbol.symbol}
            subtitle={symbol.name || 'N/A'}
            badges={
              <>
                <Badge variant='outline' className='uppercase'>
                  {symbol.type || 'UNKNOWN'}
                </Badge>
                {symbol.exchange && (
                  <Badge variant='secondary'>{symbol.exchange}</Badge>
                )}
                <Badge variant='outline' className='font-mono'>
                  ID: {symbol.id}
                </Badge>
              </>
            }
            description='Detailed view of the symbol'
          />

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              <Separator />

              <div className='grid gap-6 py-4'>
                <DetailInfoRow
                  icon={Building2}
                  label='Company Name'
                  value={symbol.name || 'N/A'}
                />

                <DetailInfoRow
                  icon={Globe}
                  label='Exchange'
                  value={symbol.exchange || 'N/A'}
                />

                <DetailInfoRow
                  icon={Tag}
                  label='Type'
                  value={
                    <span className='uppercase'>{symbol.type || 'N/A'}</span>
                  }
                />

                <DetailInfoRow
                  icon={CalendarDays}
                  label='Created At'
                  value={
                    symbol.createdAt
                      ? format(new Date(symbol.createdAt), 'PPpp')
                      : 'N/A'
                  }
                />

                <DetailInfoRow
                  icon={Clock}
                  label='Last Updated'
                  value={
                    symbol.updatedAt
                      ? format(new Date(symbol.updatedAt), 'PPpp')
                      : 'N/A'
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
