import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import { File, NotebookPen } from 'lucide-react';
import Link from 'next/link';
import { number } from 'zod';

export const ResultCard = ({
  result,
}: {
  result:
    | { record: Doc<'notes'>; score: number; type: 'note' }
    | { record: Doc<'documents'>; score: number; type: 'document' };
}) => {
  if (result.type === 'note')
    return (
      <Link href={`/dashboard/notes/${result.record._id}`}>
        <Card>
          <CardHeader>
            <CardDescription>
              <span className="flex items-center gap-2">
                <NotebookPen className="size-4" />
                {result.type}
              </span>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{result.record.text}</p>
          </CardContent>
          <CardFooter>
            <CardDescription>
              Relevance of {parseFloat(result.score.toFixed(2)) * 100}%
            </CardDescription>
          </CardFooter>
        </Card>
      </Link>
    );
  return (
    <Link href={`/dashboard/documents/${result.record._id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{result.record.title}</CardTitle>
          <CardDescription>
            <span className="flex items-center gap-2">
              <File className="size-4" />
              {result.type}
            </span>
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3">{result.record.description}</p>
        </CardContent>
        <CardFooter>
          <CardDescription>
            Relevance of {parseFloat(result.score.toFixed(2)) * 100}%
          </CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
};
