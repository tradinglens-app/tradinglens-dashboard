'use client';

import { SymbolData } from '../services/symbol.service';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Building2, CalendarDays, Globe, Tag, Clock } from 'lucide-react';
import Image from 'next/image';

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
          <SheetHeader className='p-6 pb-2'>
            <div className='flex items-start gap-4'>
              {symbol.logo ? (
                <div className='bg-muted relative h-16 w-16 overflow-hidden rounded-full border'>
                  <Image
                    src={symbol.logo}
                    alt={symbol.symbol}
                    fill
                    className='object-cover'
                  />
                </div>
              ) : (
                <div className='bg-primary/10 text-primary flex h-16 w-16 items-center justify-center rounded-full text-xl font-bold'>
                  {symbol.symbol.slice(0, 2)}
                </div>
              )}
              <div className='flex-1'>
                <SheetTitle className='text-2xl leading-tight font-bold'>
                  {symbol.symbol}
                </SheetTitle>
                <p className='text-muted-foreground'>{symbol.name || 'N/A'}</p>
              </div>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              <Badge variant='outline' className='uppercase'>
                {symbol.type || 'UNKNOWN'}
              </Badge>
              {symbol.exchange && (
                <Badge variant='secondary'>{symbol.exchange}</Badge>
              )}
              <Badge variant='outline' className='font-mono'>
                ID: {symbol.id}
              </Badge>
            </div>
            <SheetDescription className='sr-only'>
              Detailed view of the symbol
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              <Separator />

              <div className='grid gap-6 py-4'>
                <div className='flex items-start gap-3'>
                  <Building2 className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Company Name
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {symbol.name || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Globe className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>Exchange</p>
                    <p className='text-muted-foreground text-sm'>
                      {symbol.exchange || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Tag className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>Type</p>
                    <p className='text-muted-foreground text-sm uppercase'>
                      {symbol.type || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <CalendarDays className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Created At
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {symbol.createdAt
                        ? format(new Date(symbol.createdAt), 'PPpp')
                        : 'N/A'}
                    </p>
                  </div>
                </div>

                <div className='flex items-center gap-3'>
                  <Clock className='text-muted-foreground h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Last Updated
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {symbol.updatedAt
                        ? format(new Date(symbol.updatedAt), 'PPpp')
                        : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
