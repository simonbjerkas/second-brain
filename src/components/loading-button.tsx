import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const LoadingButton = ({
  isLoading,
  children,
  loadingText,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText: string;
}) => {
  return (
    <Button
      disabled={isLoading}
      className="flex gap-1 items-center"
      type="submit"
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
};
