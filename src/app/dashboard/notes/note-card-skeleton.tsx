import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export const NoteCardSkeleton = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4" />
        <Skeleton className="h-4" />
      </CardContent>
      <CardFooter>
        <Skeleton className="w-28 h-10" />
      </CardFooter>
    </Card>
  );
};
