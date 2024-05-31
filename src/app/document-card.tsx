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
import { Eye } from 'lucide-react';
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
        <Button variant="secondary" asChild className="flex items-center gap-2">
          <Link href={`/documents/${document._id}`}>
            <Eye className="size-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
