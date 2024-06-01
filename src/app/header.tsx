import Link from 'next/link';
import { HeaderActions } from './header-actions';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="bg-secondary py-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <section className="flex items-center gap-24">
          <Link
            href="/"
            className="flex gap-2 items-center text-xl font-extrabold font-mono"
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
          <div>
            <Link
              href="/"
              className="hover:text-muted-foreground font-semibold"
            >
              Documents
            </Link>
          </div>
        </section>
        <section className="flex items-center gap-8">
          <HeaderActions />
        </section>
      </div>
    </header>
  );
};
