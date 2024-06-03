'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';
import { MenuIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';

export const HeaderActions = () => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const listener = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('click', listener);
    return () => document.removeEventListener('click', listener);
  });

  return (
    <>
      {!isOpen && (
        <button className="md:hidden" onClick={() => setIsOpen(true)}>
          <MenuIcon />
        </button>
      )}
      {isOpen && (
        <div
          ref={ref}
          className="md:hidden absolute top-0 right-0 h-screen opacity-90 w-2/3 bg-primary-foreground flex justify-end pt-32"
        >
          <div className="pr-12 flex flex-col gap-6 items-end">
            <Unauthenticated>
              <SignInButton />
            </Unauthenticated>
            <Authenticated>
              <UserButton
                appearance={{
                  variables: {
                    fontFamily: 'var(--font-sans)',
                  },
                  elements: {
                    userButtonBox: {
                      flexDirection: 'row-reverse',
                    },
                    userButtonOuterIdentifier: {
                      fontWeight: '600',
                      fontSize: '16px',
                    },
                  },
                }}
                showName
                userProfileMode="navigation"
                userProfileUrl="/profile"
              />
              <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="font-semibold text-md"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/documents"
                onClick={() => setIsOpen(false)}
                className="font-semibold"
              >
                Documents
              </Link>
              <Link
                href="/dashboard/notes"
                onClick={() => setIsOpen(false)}
                className="font-semibold"
              >
                Notes
              </Link>
            </Authenticated>
            {theme === 'dark' ? (
              <Button onClick={() => setTheme('light')} size="icon">
                <Sun />
              </Button>
            ) : (
              <Button onClick={() => setTheme('dark')} size="icon">
                <Moon />
              </Button>
            )}
            <AuthLoading>
              <Skeleton className="size-7 rounded-full bg-gray-200 dark:bg-gray-700" />
            </AuthLoading>
          </div>
        </div>
      )}

      <div className="hidden md:flex items-center gap-4">
        <ModeToggle />
        <Unauthenticated>
          <SignInButton />
        </Unauthenticated>
        <Authenticated>
          <UserButton />
        </Authenticated>
        <AuthLoading>
          <Skeleton className="size-7 rounded-full bg-gray-200 dark:bg-gray-700" />
        </AuthLoading>
      </div>
    </>
  );
};
