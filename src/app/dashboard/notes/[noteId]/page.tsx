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
    <div className="relative bg-secondary w-full h-full rounded p-4 overflow-y-auto">
      <div className="absolute top-4 right-4">
        <DeleteNoteButton noteId={noteId} />
      </div>
      {note === undefined ? (
        <div className="pr-14 space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="bg-primary/10 h-6 w-full" />
          ))}
        </div>
      ) : (
        <p className="pr-14 whitespace-pre-line">{note?.text}</p>
      )}
    </div>
  );
};

export default NotePage;
