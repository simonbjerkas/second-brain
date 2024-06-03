'use client';

import { Button } from '@/components/ui/button';
import { SignInButton, useAuth } from '@clerk/nextjs';
import Link from 'next/link';

const LandingPage = () => {
  const { isSignedIn } = useAuth();
  return (
    <div className="mx-auto max-w-2xl pt-28 sm:pt-44 lg:pt-52">
      <div className="text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Take control of your team documentation
        </h1>
        <p className="mt-6 text-lg leading-8 opacity-40">
          Second Brain is a powerful tool to help you and your team search over
          all your documents and notes.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          {isSignedIn ? (
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-500 dark:bg-emerald-900 dark:text-white dark:hover:bg-emerald-800"
            >
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          ) : (
            <SignInButton>
              <Button className="bg-blue-600 hover:bg-blue-500 dark:bg-emerald-900 dark:text-white dark:hover:bg-emerald-800">
                Get started
              </Button>
            </SignInButton>
          )}
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
