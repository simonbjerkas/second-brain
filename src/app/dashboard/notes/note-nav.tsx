'use client';

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { Doc } from '@/convex/_generated/dataModel';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export const NoteNav = ({ notes }: { notes: Doc<'notes'>[] }) => {
  const pathname = usePathname();
  return (
    <NavigationMenu>
      <NavigationMenuList className="flex flex-col gap-2 items-start">
        {notes.map((note) => (
          <NavigationMenuItem key={note._id}>
            <Link href={`/dashboard/notes/${note._id}`} legacyBehavior passHref>
              <NavigationMenuLink
                active={pathname === `/dashboard/notes/${note._id}`}
                className={`w-32 ${navigationMenuTriggerStyle()}`}
              >
                {note.text.substring(0, 10) + '...'}
              </NavigationMenuLink>
            </Link>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
};
