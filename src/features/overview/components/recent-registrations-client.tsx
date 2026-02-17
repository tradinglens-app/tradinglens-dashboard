'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';
import { RecentUser } from '../services/overview-data.service';
import { useEffect, useState } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { motion, AnimatePresence } from 'framer-motion';

interface RecentRegistrationsClientProps {
  initialUsers: RecentUser[];
  initialTodayCount: number;
}

export function RecentRegistrationsClient({
  initialUsers,
  initialTodayCount
}: RecentRegistrationsClientProps) {
  const [users, setUsers] = useState<RecentUser[]>(initialUsers);
  const [todayCount, setTodayCount] = useState<number>(initialTodayCount);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Sync state with props when they change (e.g. via global router.refresh())
  useEffect(() => {
    setUsers(initialUsers);
    setTodayCount(initialTodayCount);
  }, [initialUsers, initialTodayCount]);

  if (!isMounted) {
    return null; // Prevent hydration mismatch by not rendering anything initially
  }

  return (
    <Card className='h-full'>
      <CardHeader className='relative overflow-hidden'>
        <div className='relative z-10 flex items-center justify-between'>
          <div className='flex-1'>
            <div className='flex items-center space-x-2'>
              <CardTitle>Recent Registrations</CardTitle>
              <Badge variant='secondary' className='bg-primary/10 text-primary'>
                Today: {todayCount}
              </Badge>
            </div>
            <CardDescription>Latest users joined the platform.</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className='h-[280px] pr-4'>
          <div className='space-y-4'>
            <AnimatePresence mode='popLayout'>
              {users.map((user, index) => (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className='flex items-center'
                >
                  <Avatar className='h-9 w-9'>
                    <AvatarImage src={user.profile_pic || ''} alt={user.name} />
                    <AvatarFallback>
                      {user.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className='ml-4 space-y-1'>
                    <p className='text-sm leading-none font-medium'>
                      {user.name}
                    </p>
                    <p className='text-muted-foreground text-sm'>
                      {user.email}
                    </p>
                  </div>
                  <div className='ml-auto text-right text-sm font-medium'>
                    <div>{new Date(user.created_at).toLocaleDateString()}</div>
                    <div className='text-muted-foreground text-xs'>
                      {new Date(user.created_at).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            {users.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className='text-muted-foreground text-center text-sm'
              >
                No recent registrations found.
              </motion.div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
