import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Doc } from '@/convex/_generated/dataModel';
import Link from 'next/link';

export const ResultCard = ({
  result,
}: {
  result:
    | { record: Doc<'notes'>; type: 'note' }
    | { record: Doc<'documents'>; type: 'document' };
}) => {
  if (result.type === 'note')
    return (
      <Link href={`/dashboard/notes/${result.record._id}`}>
        <Card>
          <CardHeader>
            <CardDescription>{result.type}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="line-clamp-3">{result.record.text}</p>
          </CardContent>
          <CardFooter>
            <CardDescription>Created At</CardDescription>
          </CardFooter>
        </Card>
      </Link>
    );
  return (
    <Link href={`/dashboard/documents/${result.record._id}`}>
      <Card>
        <CardHeader>
          <CardTitle>{result.record.title}</CardTitle>
          <CardDescription>{result.type}</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3">{result.record.description}</p>
        </CardContent>
        <CardFooter>
          <CardDescription>Created At</CardDescription>
        </CardFooter>
      </Card>
    </Link>
  );
};
