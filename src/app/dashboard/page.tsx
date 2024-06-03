'use client';

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Files, NotebookPen, Search, Settings2 } from 'lucide-react';
import Link from 'next/link';
import { redirect } from 'next/navigation';

const DashboardPage = () => {
  if (window.innerWidth > 768) redirect('/dashboard/documents');

  return (
    <>
      <div className="pb-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex flex-col gap-4">
        <Link href="/dashboard/search">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-4">
                <Search />
                Search
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/dashboard/documents">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-4">
                <Files />
                Documents
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/dashboard/notes">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-4">
                <NotebookPen />
                Notes
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
        <Link href="/dashboard/settings">
          <Card>
            <CardHeader>
              <CardTitle className="flex gap-4">
                <Settings2 />
                Settings
              </CardTitle>
            </CardHeader>
          </Card>
        </Link>
      </div>
    </>
  );
};

export default DashboardPage;
