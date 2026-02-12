'use client';

import { navItems } from '@/config/nav-config';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Icons } from '@/components/icons';
import { cn } from '@/lib/utils';

interface MenuPermissionListProps {
  selectedMenuKeys: string[];
  onToggleMenu: (menuKey: string, enabled: boolean) => void;
  disabled?: boolean;
}

/**
 * Flatten all menu items from nav-config into a list with depth info
 */
function flattenMenuItems() {
  const items: {
    key: string;
    title: string;
    icon?: keyof typeof Icons;
    depth: number;
    parentTitle?: string;
  }[] = [];

  for (const item of navItems) {
    // Skip items without a real URL
    if (item.url && item.url !== '#') {
      items.push({
        key: item.url,
        title: item.title,
        icon: item.icon,
        depth: 0
      });
    }

    if (item.items && item.items.length > 0) {
      // If parent has no real URL, still show it as a group header
      if (!item.url || item.url === '#') {
        items.push({
          key: `group:${item.title}`,
          title: item.title,
          icon: item.icon,
          depth: 0
        });
      }

      for (const child of item.items) {
        if (child.url && child.url !== '#') {
          items.push({
            key: child.url,
            title: child.title,
            icon: child.icon,
            depth: 1,
            parentTitle: item.title
          });
        }
      }
    }
  }

  return items;
}

export function MenuPermissionList({
  selectedMenuKeys,
  onToggleMenu,
  disabled = false
}: MenuPermissionListProps) {
  const menuItems = flattenMenuItems();

  return (
    <div className='flex flex-col gap-1'>
      {menuItems.map((item) => {
        const isGroup = item.key.startsWith('group:');
        const isEnabled = selectedMenuKeys.includes(item.key);

        if (isGroup) {
          return (
            <div
              key={item.key}
              className='mt-4 mb-1 flex items-center gap-2 px-2 first:mt-0'
            >
              {item.icon &&
                Icons[item.icon] &&
                (() => {
                  const IconComponent = Icons[item.icon!];
                  return (
                    <IconComponent className='text-muted-foreground h-4 w-4' />
                  );
                })()}
              <span className='text-muted-foreground text-xs font-semibold tracking-wider uppercase'>
                {item.title}
              </span>
            </div>
          );
        }

        return (
          <div
            key={item.key}
            className={cn(
              'flex items-center justify-between rounded-lg px-3 py-2.5 transition-colors',
              item.depth > 0 && 'ml-6',
              isEnabled
                ? 'bg-primary/5 border-primary/20 border'
                : 'hover:bg-muted/50 border border-transparent',
              disabled && 'pointer-events-none opacity-50'
            )}
          >
            <div className='flex items-center gap-3'>
              {item.icon &&
                Icons[item.icon] &&
                (() => {
                  const IconComponent = Icons[item.icon!];
                  return (
                    <IconComponent
                      className={cn(
                        'h-4 w-4',
                        isEnabled ? 'text-primary' : 'text-muted-foreground'
                      )}
                    />
                  );
                })()}
              <Label
                htmlFor={`menu-${item.key}`}
                className='cursor-pointer text-sm font-medium'
              >
                {item.title}
              </Label>
            </div>
            <Switch
              id={`menu-${item.key}`}
              checked={isEnabled}
              onCheckedChange={(checked) => onToggleMenu(item.key, checked)}
              disabled={disabled}
            />
          </div>
        );
      })}
    </div>
  );
}
