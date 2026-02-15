'use client';

import { Notification } from '../services/notifications.service';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { format } from 'date-fns';
import {
  Bell,
  Calendar,
  Clock,
  User,
  MessageSquare,
  Eye,
  EyeOff
} from 'lucide-react';
import { toLabel } from '@/lib/db-enums.utils';
import { DetailSheetHeader } from '@/components/ui/detail-sheet-header';
import { DetailInfoRow } from '@/components/ui/detail-info-row';

interface NotificationDetailSheetProps {
  isOpen: boolean;
  onClose: () => void;
  notification: Notification | null;
}

export function NotificationDetailSheet({
  isOpen,
  onClose,
  notification
}: NotificationDetailSheetProps) {
  if (!notification) return null;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className='w-full p-0 sm:max-w-xl' side='right'>
        <div className='flex h-full flex-col'>
          <DetailSheetHeader
            icon={{ Icon: Bell }}
            title={
              notification.type ? toLabel(notification.type) : 'Notification'
            }
            subtitle={`ID: ${notification.id}`}
            badges={
              <>
                <Badge variant='outline' className='capitalize'>
                  {notification.type
                    ? toLabel(notification.type)
                    : 'Unknown Type'}
                </Badge>
                <Badge
                  variant={notification.is_read ? 'secondary' : 'default'}
                  className={
                    notification.is_read
                      ? 'bg-green-100 text-green-800 hover:bg-green-100'
                      : 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                  }
                >
                  {notification.is_read ? (
                    <Eye className='mr-1 h-3 w-3' />
                  ) : (
                    <EyeOff className='mr-1 h-3 w-3' />
                  )}
                  {notification.is_read ? 'Read' : 'Unread'}
                </Badge>
              </>
            }
            description='Detailed view of the notification'
          />

          <div className='flex-1 overflow-y-auto px-6'>
            <div className='space-y-6 pb-6'>
              <Separator />

              {/* Sender info */}
              {notification.sender && (
                <div className='flex items-start gap-3'>
                  <User className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Sender (ID: {notification.sender_id})
                    </p>
                    <div className='mt-2 flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={notification.sender.profile_pic || ''}
                        />
                        <AvatarFallback>
                          {(notification.sender.name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium'>
                          {notification.sender.name || 'Unknown'}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          @{notification.sender.username || 'unknown'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Recipient info */}
              {(notification.recipient || notification.user_id) && (
                <div className='flex items-start gap-3'>
                  <User className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Recipient (ID: {notification.user_id})
                    </p>
                    <div className='mt-2 flex items-center gap-3'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage
                          src={notification.recipient?.profile_pic || ''}
                        />
                        <AvatarFallback>
                          {(notification.recipient?.name || 'U').charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='text-sm font-medium'>
                          {notification.recipient?.name || 'Unknown'}
                        </p>
                        <p className='text-muted-foreground text-xs'>
                          {notification.recipient?.username &&
                            `@${notification.recipient.username}`}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Message EN */}
              <div className='flex items-start gap-3'>
                <MessageSquare className='text-muted-foreground mt-0.5 h-5 w-5' />
                <div className='w-full space-y-1'>
                  <p className='text-sm leading-none font-medium'>
                    Message (EN)
                  </p>
                  <div className='bg-muted text-foreground mt-2 rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap'>
                    {notification.message_en || 'No message'}
                  </div>
                </div>
              </div>

              {/* Message TH */}
              {notification.message_th && (
                <div className='flex items-start gap-3'>
                  <MessageSquare className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='w-full space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      Message (TH)
                    </p>
                    <div className='bg-muted text-foreground mt-2 rounded-md p-4 text-sm leading-relaxed whitespace-pre-wrap'>
                      {notification.message_th}
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              {notification.metadata && (
                <div className='flex items-start gap-3'>
                  <MessageSquare className='text-muted-foreground mt-0.5 h-5 w-5' />
                  <div className='w-full space-y-1'>
                    <p className='text-sm leading-none font-medium'>Metadata</p>
                    <pre className='bg-muted text-foreground mt-2 overflow-x-auto rounded-md p-4 text-xs leading-relaxed'>
                      {JSON.stringify(notification.metadata, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Timestamps */}
              <div className='grid grid-cols-2 gap-4 pt-4'>
                <DetailInfoRow
                  icon={Calendar}
                  label='Created At'
                  value={
                    notification.created_at
                      ? format(new Date(notification.created_at), 'PP p')
                      : 'N/A'
                  }
                />

                <DetailInfoRow
                  icon={Clock}
                  label='Last Updated'
                  value={
                    notification.updated_at
                      ? format(new Date(notification.updated_at), 'PP p')
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
