'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';

interface ReportReason {
  titleEn?: string;
  descriptionEn?: string;
  titleTh?: string;
  descriptionTh?: string;
}

interface ReportReasonsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  reasons: ReportReason[];
  postTitle: string;
  reportCount: number;
}

export function ReportReasonsModal({
  open,
  onOpenChange,
  reasons,
  postTitle,
  reportCount
}: ReportReasonsModalProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-h-[80vh] max-w-2xl overflow-y-auto'>
        <DialogHeader>
          <DialogTitle>Report Reasons</DialogTitle>
          <DialogDescription asChild>
            <div className='mt-2'>
              <div className='text-foreground font-medium'>{postTitle}</div>
              <Badge variant='secondary' className='mt-2'>
                {reportCount} {reportCount === 1 ? 'report' : 'reports'}
              </Badge>
            </div>
          </DialogDescription>
        </DialogHeader>

        <div className='mt-4 space-y-4'>
          {reasons.length === 0 ? (
            <p className='text-muted-foreground text-sm'>No reasons provided</p>
          ) : (
            reasons.map((reason, index) => (
              <div key={index} className='space-y-3 rounded-lg border p-4'>
                {/* English Reason */}
                {(reason.titleEn || reason.descriptionEn) && (
                  <div>
                    <div className='mb-1 flex items-center gap-2'>
                      <Badge variant='outline'>EN</Badge>
                      {reason.titleEn && (
                        <h4 className='font-semibold'>{reason.titleEn}</h4>
                      )}
                    </div>
                    {reason.descriptionEn && (
                      <p className='text-muted-foreground ml-12 text-sm'>
                        {reason.descriptionEn}
                      </p>
                    )}
                  </div>
                )}

                {/* Thai Reason */}
                {(reason.titleTh || reason.descriptionTh) && (
                  <div>
                    <div className='mb-1 flex items-center gap-2'>
                      <Badge variant='outline'>TH</Badge>
                      {reason.titleTh && (
                        <h4 className='font-semibold'>{reason.titleTh}</h4>
                      )}
                    </div>
                    {reason.descriptionTh && (
                      <p className='text-muted-foreground ml-12 text-sm'>
                        {reason.descriptionTh}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
