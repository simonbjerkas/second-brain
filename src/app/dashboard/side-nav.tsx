'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { cn } from '@/lib/utils';
import { Files, NotebookPen, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const SideNav = () => {
  const pathname = usePathname();
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col gap-4 items-start">
        <NavigationMenuItem>
          <Link href="/dashboard/documents" legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname.startsWith('/dashboard/documents')}
              className={cn(navigationMenuTriggerStyle(), 'flex gap-2')}
            >
              <Files className="size-4" />
              Documents
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/notes" legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname.startsWith('/dashboard/notes')}
              className={cn(navigationMenuTriggerStyle(), 'flex gap-2')}
            >
              <NotebookPen className="size-4" />
              Notes
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/settings" legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname.startsWith('/dashboard/settings')}
              className={cn(navigationMenuTriggerStyle(), 'flex gap-2')}
            >
              <Settings2 className="size-4" />
              Settings
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};
