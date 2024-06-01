import type { Metadata } from 'next';
import Link from 'next/link';
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
    <div className="flex gap-24">
      <aside className="w-48 border-r">
        <SideNav />
      </aside>
      <div className="flex-1">{children}</div>
    </div>
  );
}
