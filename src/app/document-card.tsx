import { Button } from '@/components/ui/button';
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

export const DocumentCard = ({ document }: { document: Doc<'documents'> }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{document.title}</CardTitle>
        <CardDescription></CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content here</p>
      </CardContent>
      <CardFooter>
        <Button variant="secondary" asChild>
          <Link href={`/document/${document._id}`}>View</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
