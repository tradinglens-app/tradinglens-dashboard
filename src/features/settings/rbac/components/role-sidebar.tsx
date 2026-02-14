'use client';

import { cn } from '@/lib/utils';
import { Shield, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Role {
  key: string;
  name: string;
  description: string;
}

interface RoleSidebarProps {
  roles: Role[];
  selectedRole: string | null;
  onSelectRole: (roleKey: string) => void;
  permissionCounts: Record<string, number>;
}

export function RoleSidebar({
  roles,
  selectedRole,
  onSelectRole,
  permissionCounts
}: RoleSidebarProps) {
  return (
    <div className='flex w-64 flex-col gap-1 border-r pr-4'>
      <div className='mb-3 flex items-center gap-2 px-2'>
        <Shield className='text-muted-foreground h-4 w-4' />
        <span className='text-sm font-semibold'>Roles</span>
      </div>
      {roles.map((role) => {
        const isActive = selectedRole === role.key;
        const count = permissionCounts[role.key] || 0;
        return (
          <Button
            key={role.key}
            variant={isActive ? 'secondary' : 'ghost'}
            className={cn(
              'h-auto w-full justify-start gap-3 px-3 py-3',
              isActive && 'bg-accent'
            )}
            onClick={() => onSelectRole(role.key)}
          >
            <ShieldCheck
              className={cn(
                'h-4 w-4 shrink-0',
                isActive ? 'text-primary' : 'text-muted-foreground'
              )}
            />
            <div className='flex flex-1 flex-col items-start text-left'>
              <span className='text-sm font-medium'>{role.name}</span>
              <span className='text-muted-foreground text-xs'>
                {role.description}
              </span>
            </div>
            <span className='bg-muted text-muted-foreground inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-medium'>
              {count}
            </span>
          </Button>
        );
      })}
    </div>
  );
}
