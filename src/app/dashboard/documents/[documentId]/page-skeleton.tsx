import { Skeleton } from '@/components/ui/skeleton';

export const PageSkeleton = () => {
  return (
    <>
      <div className="pb-10">
        <Skeleton className="w-1/2 h-10" />
      </div>
      <div className="flex gap-2 pb-4">
        <Skeleton className="w-20 h-8" />
        <Skeleton className="w-14 h-8" />
      </div>
      <div>
        <Skeleton className="w-full h-[65vh]" />
      </div>
    </>
  );
};
