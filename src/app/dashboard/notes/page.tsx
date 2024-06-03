'use client';

import { Card, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { api } from '@/convex/_generated/api';
import { useOrganization } from '@clerk/nextjs';
import { useQuery } from 'convex/react';
import Image from 'next/image';
import Link from 'next/link';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { CreateNoteButton } from './create-note-button';

const NotesPage = () => {
  const { organization } = useOrganization();
  const notes = useQuery(api.notes.getNotes, {
    orgId: organization?.id,
  });
  return (
    <>
      <div className="hidden md:flex flex-col justify-center items-center gap-12 pt-6">
        <Image src="/selection.svg" alt="" width={300} height={300} />
        <h2 className="text-2xl font-semibold">Please select a note</h2>
      </div>
      <div className="md:hidden flex flex-col md:flex-row md:justify-between md:items-center gap-2 pb-6">
        <h1 className="text-3xl md:text-4xl font-bold">My Notes</h1>
        <Breadcrumb className="md:hidden my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/notes">Notes</BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {notes && notes.length === 0 ? (
          notes === undefined && <Skeleton className="w-44 h-10" />
        ) : (
          <CreateNoteButton />
        )}
      </div>
      <div className="md:hidden flex flex-col gap-4">
        {notes === undefined ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          notes?.map((note) => (
            <Link href={`/dashboard/notes/${note._id}`} key={note._id}>
              <Card className="w-full">
                <CardHeader>
                  <p className="line-clamp-2 text-sm">{note.text}</p>
                </CardHeader>
              </Card>
            </Link>
          ))
        )}
      </div>
    </>
  );
};

export default NotesPage;
