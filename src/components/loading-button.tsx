import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

export const LoadingButton = ({
  isLoading,
  children,
  loadingText,
  onClick,
}: {
  isLoading: boolean;
  children: React.ReactNode;
  loadingText: string;
  onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}) => {
  return (
    <Button
      disabled={isLoading}
      className="flex gap-1 items-center"
      type="submit"
      onClick={(e) => onClick?.(e)}
    >
      {isLoading && <Loader2 className="animate-spin" />}
      {isLoading ? loadingText : children}
    </Button>
  );
};
