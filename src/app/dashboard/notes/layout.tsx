'use client';

import { useQuery } from 'convex/react';
import { CreateNoteButton } from './create-note-button';
import { api } from '@/convex/_generated/api';
import Image from 'next/image';
import Link from 'next/link';
import { NoteNav } from './note-nav';

const NotesLayout = ({ children }: { children: React.ReactNode }) => {
  const notes = useQuery(api.notes.getNotes);
  return (
    <>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">My Notes</h1>
        {notes && notes.length > 0 && <CreateNoteButton />}
      </div>
      <div className="flex gap-16">
        <div className="w-44 border-r">
          <NoteNav notes={notes || []} />
        </div>
        <div className="bg-secondary rounded w-full p-4 min-h-[500px]">
          {children}
        </div>
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

export default NotesLayout;
