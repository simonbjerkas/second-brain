'use client';

import Link from 'next/link';
import { HeaderActions } from './header-actions';
import Image from 'next/image';
import { OrganizationSwitcher, useAuth } from '@clerk/nextjs';

export const Header = () => {
  const { isSignedIn } = useAuth();
  return (
    <header className="relative z-10 bg-transparent py-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <section className="flex items-center gap-8 lg:gap-24 md:gap-16">
          <Link
            href="/"
            className="flex gap-2 items-center text-sm md:text-xl font-extrabold font-mono"
          >
            <Image
              src="/logo.jpg"
              alt="SecondBrainLogo"
              width={40}
              height={40}
              className="rounded-md"
            />
            SecondBrain
          </Link>
          {isSignedIn && (
            <div className="flex items-center gap-8">
              <OrganizationSwitcher
                appearance={{
                  elements: {
                    organizationPreviewMainIdentifier: {
                      color: 'hsl(60 9.1% 97.8%)',
                    },
                    userPreviewMainIdentifier: {
                      color: 'hsl(60 9.1% 97.8%)',
                    },
                  },
                }}
              />
              <Link
                href="/dashboard"
                className="hidden md:block hover:text-muted-foreground font-semibold"
              >
                Dashboard
              </Link>
              <Link
                href="/dashboard/search"
                className="hidden md:block hover:text-muted-foreground font-semibold"
              >
                Search
              </Link>
              <Link
                href="/dashboard/documents"
                className="hidden lg:block hover:text-muted-foreground font-semibold"
              >
                Documents
              </Link>
              <Link
                href="/dashboard/notes"
                className="hidden lg:block hover:text-muted-foreground font-semibold"
              >
                Notes
              </Link>
            </div>
          )}
        </section>
        <HeaderActions />
      </div>
    </header>
  );
};
