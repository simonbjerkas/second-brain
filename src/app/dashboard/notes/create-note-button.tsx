'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CreateNoteForm } from './create-note-form';
import { useState } from 'react';
import { SquarePen } from 'lucide-react';

export const CreateNoteButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog onOpenChange={setIsOpen} open={isOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <SquarePen className="size-4" />
          Create a new note
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create</DialogTitle>
          <DialogDescription>
            Create a team note for you to search over in the future.
          </DialogDescription>
        </DialogHeader>
        <CreateNoteForm onUpload={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  );
};
