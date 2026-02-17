'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface DashboardRefreshProps {
  interval?: number; // in milliseconds
}

export function DashboardRefresh({ interval = 15000 }: DashboardRefreshProps) {
  const router = useRouter();

  useEffect(() => {
    const timer = setInterval(() => {
      // router.refresh() triggers a server-side re-validation of all server components
      // in the current view without losing client-side state.
      router.refresh();
    }, interval);

    return () => clearInterval(timer);
  }, [router, interval]);

  return null;
}
