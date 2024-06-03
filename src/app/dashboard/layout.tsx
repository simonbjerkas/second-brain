import type { Metadata } from 'next';
import { SideNav } from './side-nav';

export const metadata: Metadata = {
  title: 'Second Brain',
  description: 'Your second brain for all your notes and thoughts.',
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="md:flex gap-24 relative">
      <aside className="hidden md:block w-48 md:border-r">
        <SideNav />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
