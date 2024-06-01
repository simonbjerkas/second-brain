'use client';

import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { LoadingButton } from '@/components/loading-button';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export const DeleteDocumentButton = ({
  documentId,
}: {
  documentId: Id<'documents'>;
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const deleteDocument = useMutation(api.documents.deleteDocument);
  const router = useRouter();
  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => setIsOpen(open)}>
      <AlertDialogTrigger asChild>
        <Button size="icon" variant="destructive">
          <Trash2 className="size-4" />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure you want to delete this document?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this
            document, and all correspondig chat messages.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction asChild>
            <LoadingButton
              onClick={() => {
                setIsLoading(true);
                deleteDocument({ documentId })
                  .then(() => router.push('/'))
                  .finally(() => setIsLoading(false));
              }}
              isLoading={isLoading}
              loadingText="Deleting"
            >
              Delete
            </LoadingButton>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
