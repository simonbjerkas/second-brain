'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';
import { DeleteNoteButton } from './delete-note-button';
import { Skeleton } from '@/components/ui/skeleton';

const NotePage = () => {
  const { noteId } = useParams<{ noteId: Id<'notes'> }>();
  const note = useQuery(api.notes.getNote, { noteId });
  return (
    <>
      {note === undefined ? (
        <Skeleton className="size-full" />
      ) : (
        <div className="relative bg-secondary w-full h-full rounded p-4 overflow-y-auto">
          <div className="absolute top-4 right-4">
            <DeleteNoteButton noteId={noteId} />
          </div>
          <p className="pr-14 whitespace-pre-line">{note?.text}</p>
        </div>
      )}
    </>
  );
};

export default NotePage;
