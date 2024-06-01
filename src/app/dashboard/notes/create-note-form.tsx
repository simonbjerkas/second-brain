'use client';

import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingButton } from '@/components/loading-button';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(1).max(250),
  content: z.string().min(1).max(10000),
});

export const CreateNoteForm = ({ onCreate }: { onCreate: () => void }) => {
  const createNote = useMutation(api.notes.createNote);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      content: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createNote(values);
    onCreate();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Expense Report" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="What do you want to write my friend?"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Creating"
        >
          Create
        </LoadingButton>
      </form>
    </Form>
  );
};
