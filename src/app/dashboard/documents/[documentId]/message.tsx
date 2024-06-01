import { cn } from '@/lib/utils';

export const Message = ({
  text,
  isHuman,
}: {
  text: string;
  isHuman: boolean;
}) => {
  return (
    <div className={cn('w-full flex', { 'justify-end ': isHuman })}>
      <div className="max-w-[75%]">
        <p
          className={cn(
            { 'bg-blue-500 dark:bg-emerald-800 text-right': isHuman },
            { 'bg-blue-200 dark:bg-emerald-600': !isHuman },
            'rounded-xl py-2 px-4 whitespace-pre-line'
          )}
        >
          {text}
        </p>
      </div>
    </div>
  );
};
