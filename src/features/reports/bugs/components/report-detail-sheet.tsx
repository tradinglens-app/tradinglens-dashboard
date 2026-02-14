'use client';

import { app_problem_report } from '@/generated/prisma-client';
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
import { Bug, Calendar, Clock, AlignLeft } from 'lucide-react';

interface ReportDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  report: app_problem_report | null;
}

export function ReportDetailSheet({
  isOpen,
  onClose,
  report
}: ReportDetailSheetProps) {
  if (!report) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <SheetHeader className='p-6 pb-2'>
            <div className='flex items-start gap-4'>
              <div className='bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-full'>
                <Bug className='h-6 w-6' />
              </div>
              <div className='flex-1'>
                <SheetTitle className='text-xl leading-tight font-bold'>
                  {report.topic || 'No Topic'}
                </SheetTitle>
                <p className='text-muted-foreground mt-1 text-xs'>
                  ID: {report.id}
                </p>
              </div>
            </div>

            <div className='mt-4 flex flex-wrap gap-2'>
              <Badge
                variant={report.status === 'Open' ? 'destructive' : 'secondary'}
                className={
                  report.status === 'Resolved'
                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                    : report.status === 'In Progress'
                      ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100'
                      : ''
                }
              >
                {report.status || 'Unknown'}
              </Badge>
            </div>
            <SheetDescription className='sr-only'>
              Detailed view of the bug report
            </SheetDescription>
          </SheetHeader>

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              <Separator />

              <div className='space-y-4 py-2'>
                <div className='flex items-start gap-3'>
                  <AlignLeft className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='w-full space-y-1'>
                    <p className='text-sm leading-none font-medium'>Details</p>
                    <div className='bg-muted text-foreground mt-2 rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap'>
                      {report.details || 'No details provided.'}
                    </div>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-4 pt-4'>
                  <div className='flex items-center gap-3'>
                    <Calendar className='text-muted-foreground h-5 w-5' />
                    <div className='space-y-1'>
                      <p className='text-sm leading-none font-medium'>
                        Created At
                      </p>
                      <p className='text-muted-foreground text-sm'>
                        {report.created_at
                          ? format(new Date(report.created_at), 'PP p')
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
                        {report.updated_at
                          ? format(new Date(report.updated_at), 'PP p')
                          : 'N/A'}
                      </p>
                    </div>
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
