'use client';

import { LoadingButton } from '@/components/loading-button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { api } from '@/convex/_generated/api';
import { Doc, Id } from '@/convex/_generated/dataModel';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'convex/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  search: z.string().min(1).max(250),
});

export const SearchForm = ({
  setResults,
}: {
  setResults: (notes: typeof api.search.searchAction._returnType) => void;
}) => {
  const searchAction = useAction(api.search.searchAction);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      search: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await searchAction(values).then((notes) => setResults(notes));
    form.reset();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
        <FormField
          control={form.control}
          name="search"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Search over all your notes and documents"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Searching"
        >
          Search
        </LoadingButton>
      </form>
    </Form>
  );
};
