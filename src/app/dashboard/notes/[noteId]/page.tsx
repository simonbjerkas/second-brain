'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { useParams } from 'next/navigation';

const NotePage = () => {
  const { noteId } = useParams<{ noteId: Id<'notes'> }>();
  const note = useQuery(api.notes.getNote, { noteId });
  return <div>{note?.text}</div>;
};

export default NotePage;
