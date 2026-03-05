'use client';

import { usePresenceWebSocket } from '@/hooks/use-presence-websocket';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from '@/components/ui/sheet';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { IconUsers, IconWifi, IconWifiOff } from '@tabler/icons-react';
import { useCallback, useRef, useState } from 'react';
import { OnlineUser } from '@/hooks/use-presence-websocket';
import { motion, AnimatePresence } from 'framer-motion';

const MIN_WIDTH = 448; // sm:max-w-md ≈ 28rem

export function ActiveUsersCard() {
  const { data, isConnected, error } = usePresenceWebSocket();

  const value = data?.payload?.count ?? 0;
  const users = (data?.payload as any)?.users ?? [];

  // Resizable sidebar state
  const [sidebarWidth, setSidebarWidth] = useState(MIN_WIDTH);
  const [isResizing, setIsResizing] = useState(false);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(MIN_WIDTH);
  const currentDragWidth = useRef(MIN_WIDTH);
  const onMouseDown = useCallback(
    (e: React.MouseEvent) => {
      isDragging.current = true;
      setIsResizing(true);
      startX.current = e.clientX;
      startWidth.current = sidebarWidth;
      currentDragWidth.current = sidebarWidth;
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';

      const onMouseMove = (ev: MouseEvent) => {
        if (!isDragging.current) return;
        const delta = startX.current - ev.clientX; // dragging left = wider
        const maxWidth = Math.floor(window.innerWidth * 0.5);
        const newWidth = Math.min(
          maxWidth,
          Math.max(MIN_WIDTH, startWidth.current + delta)
        );
        currentDragWidth.current = newWidth;

        // Bypass React reconcile cycle by mutating DOM directly for buttery smooth dragging
        const sidebar = document.getElementById('active-users-sidebar-card');
        if (sidebar) {
          sidebar.style.width = `${newWidth}px`;
        }
      };

      const onMouseUp = () => {
        isDragging.current = false;
        setIsResizing(false);
        setSidebarWidth(currentDragWidth.current); // Sync final width state when done dragging
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        document.removeEventListener('mousemove', onMouseMove);
        document.removeEventListener('mouseup', onMouseUp);
      };

      document.addEventListener('mousemove', onMouseMove);
      document.addEventListener('mouseup', onMouseUp);
    },
    [sidebarWidth]
  );

  // Drag to scroll state
  const scrollRef = useRef<HTMLDivElement>(null);
  const isDraggingScroll = useRef(false);
  const startScrollY = useRef(0);
  const startScrollTop = useRef(0);

  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault(); // Prevent text selection
    isDraggingScroll.current = true;
    startScrollY.current = e.clientY;

    // Radix UI puts the actual scrollable element inside a data-radix-scroll-area-viewport
    const viewport = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (viewport) {
      startScrollTop.current = viewport.scrollTop;
    }
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingScroll.current) return;

    const viewport = scrollRef.current?.querySelector(
      '[data-radix-scroll-area-viewport]'
    );
    if (viewport) {
      const delta = startScrollY.current - e.clientY;
      viewport.scrollTop = startScrollTop.current + delta;
    }
  };

  const handlePointerUp = () => {
    isDraggingScroll.current = false;
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Card className='hover:bg-muted/50 @container/card cursor-pointer transition-colors'>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <div className='flex flex-col gap-1'>
              <div className='flex items-center gap-1.5'>
                <CardDescription className='text-xs font-medium tracking-wider uppercase'>
                  Active Users
                </CardDescription>
                {isConnected ? (
                  <IconWifi className='h-3 w-3 text-green-500' title='Live' />
                ) : error ? (
                  <IconWifiOff className='h-3 w-3 text-red-400' title={error} />
                ) : (
                  <IconWifiOff
                    className='text-muted-foreground h-3 w-3 animate-pulse'
                    title='Connecting…'
                  />
                )}
              </div>
              <CardTitle className='flex items-center gap-2 text-2xl font-bold'>
                {value.toLocaleString()}
              </CardTitle>
            </div>
            <div className='bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full'>
              <IconUsers className='text-primary h-4 w-4' />
            </div>
          </CardHeader>
          <CardContent className='pt-0'>
            <div className='flex flex-col gap-1'>
              <p className='text-muted-foreground text-[10px] leading-relaxed'>
                {isConnected
                  ? 'Live data from presence service'
                  : 'Tracking users currently online'}
              </p>
            </div>
          </CardContent>
        </Card>
      </SheetTrigger>

      <SheetContent
        id='active-users-sidebar-card'
        style={{ width: sidebarWidth }}
        className='flex !max-w-none flex-col p-0 transition-none'
      >
        {/* Drag handle — left edge */}
        <div
          onMouseDown={onMouseDown}
          className='group hover:bg-primary/20 absolute top-0 left-0 z-50 h-full w-1.5 cursor-col-resize transition-colors'
          title='Drag to resize'
        >
          <div className='bg-muted-foreground/20 group-hover:bg-primary/60 absolute top-1/2 left-0 h-12 w-1 -translate-y-1/2 rounded-full transition-colors' />
        </div>

        <div className='flex h-full flex-col gap-4 overflow-hidden px-6 pt-6'>
          <SheetHeader className='shrink-0 border-b pb-4'>
            <SheetTitle className='flex items-center gap-2'>
              <IconUsers className='h-5 w-5' />
              Online Users
              <Badge variant='secondary' className='ml-2'>
                {value}
              </Badge>
            </SheetTitle>
            <SheetDescription>
              People who are currently active and viewing the dashboard.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea
            ref={scrollRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerLeave={handlePointerUp}
            className='@container/list -mx-6 min-h-0 flex-1 touch-none select-none'
          >
            <div className='grid grid-cols-1 gap-4 px-8 pb-8 @md/list:grid-cols-2 @xl/list:grid-cols-3 @3xl/list:grid-cols-4'>
              <AnimatePresence mode='popLayout'>
                {users.length === 0 ? (
                  <motion.div
                    key='empty'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className='text-muted-foreground flex h-40 flex-col items-center justify-center'
                  >
                    <IconUsers className='mb-2 h-8 w-8 opacity-20' />
                    <p className='text-sm'>No active users currently</p>
                  </motion.div>
                ) : (
                  users.map((user: OnlineUser, index: number) => (
                    <motion.div
                      layout
                      key={user.user_id}
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0, x: 0 }}
                      exit={{ opacity: 0, x: 50, scale: 0.95 }}
                      transition={{ duration: 0.3, delay: index === 0 ? 0 : 0 }}
                      className='flex items-center gap-3'
                    >
                      <div className='relative'>
                        <Avatar className='h-10 w-10 border shadow-sm'>
                          <AvatarImage src={user.profile_pic} alt={user.name} />
                          <AvatarFallback>
                            {user.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className='border-background absolute right-0 bottom-0 h-3 w-3 rounded-full border-2 bg-green-500' />
                      </div>
                      <div className='flex flex-col'>
                        <span className='text-sm leading-none font-medium'>
                          {user.name}
                        </span>
                        <span className='text-muted-foreground mt-1 text-xs'>
                          ID: {user.user_id}
                        </span>
                      </div>
                    </motion.div>
                  ))
                )}
              </AnimatePresence>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  );
}
