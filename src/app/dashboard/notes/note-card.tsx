import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Doc } from '@/convex/_generated/dataModel';
import { Eye } from 'lucide-react';
import Link from 'next/link';

export const NoteCard = ({ note }: { note: Doc<'notes'> }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        {note.description ? (
          <p>{note.description}</p>
        ) : (
          <div className="space-y-2">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-full h-6" />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button variant="secondary" asChild className="flex items-center gap-2">
          <Link href={`/notes/${note._id}`}>
            <Eye className="size-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
