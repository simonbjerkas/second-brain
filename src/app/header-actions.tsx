'use client';

import { ModeToggle } from '@/components/mode-toggle';
import { Skeleton } from '@/components/ui/skeleton';
import { SignInButton, UserButton } from '@clerk/nextjs';
import { Authenticated, Unauthenticated, AuthLoading } from 'convex/react';

export const HeaderActions = () => {
  return (
    <>
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
    </>
  );
};
