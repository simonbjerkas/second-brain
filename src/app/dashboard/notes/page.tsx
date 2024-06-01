'use client';

import { useQuery } from 'convex/react';
import { CreateNoteButton } from './create-note-button';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import { NoteCardSkeleton } from './note-card-skeleton';
import { NoteCard } from './note-card';

const NotesPage = () => {
  const notes = useQuery(api.notes.getNotes);
  return (
    <>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">My Notes</h1>
        {notes && notes.length > 0 && <CreateNoteButton />}
      </div>
      <div className="grid grid-cols-3 gap-8">
        {!notes
          ? Array.from({ length: 6 }).map((_, i) => (
              <NoteCardSkeleton key={i} />
            ))
          : notes?.map((note) => <NoteCard key={note._id} note={note} />)}
      </div>
      {notes && notes.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-8 py-12">
          <Image src="/notebook.svg" alt="" width={300} height={300} />
          <h2 className="text-2xl font-semibold">You have no notes.</h2>
          <CreateNoteButton />
        </div>
      )}
    </>
  );
};

export default NotesPage;
