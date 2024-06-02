'use client';

import { useQuery } from 'convex/react';
import { CreateNoteButton } from './create-note-button';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { NoteNav } from './note-nav';
import { Skeleton } from '@/components/ui/skeleton';
import { useOrganization } from '@clerk/nextjs';

const NotesLayout = ({ children }: { children: React.ReactNode }) => {
  const { organization } = useOrganization();
  const notes = useQuery(api.notes.getNotes, {
    orgId: organization?.id,
  });
  return (
    <>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">My Notes</h1>
        {notes && notes.length === 0 ? (
          notes === undefined && <Skeleton className="w-44 h-10" />
        ) : (
          <CreateNoteButton />
        )}
      </div>

      {notes && notes.length === 0 ? (
        <div className="flex flex-col justify-center items-center gap-8 py-12">
          <Image src="/notebook.svg" alt="" width={300} height={300} />
          <h2 className="text-2xl font-semibold">You have no notes.</h2>
          <CreateNoteButton />
        </div>
      ) : (
        <div className="flex gap-16">
          <div className="w-44 border-r">
            {notes === undefined ? (
              <div className="flex flex-col gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-28" />
                ))}
              </div>
            ) : (
              <NoteNav notes={notes || []} />
            )}
          </div>
          <div className="w-full h-[500px]">{children}</div>
        </div>
      )}
    </>
  );
};

export default NotesLayout;
