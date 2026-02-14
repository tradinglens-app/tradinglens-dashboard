'use client';

import { app_problem_report } from '@/generated/prisma-client';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Bug, Calendar, Clock, AlignLeft } from 'lucide-react';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailContentBox } from '@/components/ui/detail-content-box';
import { DetailInfoRow } from '@/components/ui/detail-info-row';

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

  const statusColorMap: Record<string, 'green' | 'yellow' | 'red' | 'gray'> = {
    Resolved: 'green',
    'In Progress': 'yellow',
    Open: 'red'
  };

  const statusColor = statusColorMap[report.status || ''] || 'gray';

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <DetailSheetHeader
            icon={{ Icon: Bug }}
            title={report.topic || 'No Topic'}
            subtitle={`ID: ${report.id}`}
            badges={
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
            }
            description='Detailed view of the bug report'
          />

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              <Separator />

              <div className='space-y-4 py-2'>
                <DetailContentBox
                  icon={AlignLeft}
                  label='Details'
                  content={report.details}
                  placeholder='No details provided.'
                />

                <div className='grid grid-cols-2 gap-4 pt-4'>
                  <DetailInfoRow
                    icon={Calendar}
                    label='Created At'
                    value={
                      report.created_at
                        ? format(new Date(report.created_at), 'PP p')
                        : 'N/A'
                    }
                  />

                  <DetailInfoRow
                    icon={Clock}
                    label='Last Updated'
                    value={
                      report.updated_at
                        ? format(new Date(report.updated_at), 'PP p')
                        : 'N/A'
                    }
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
