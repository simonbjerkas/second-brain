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
import { useMutation } from 'convex/react';
import { api } from '@/convex/_generated/api';
import { LoadingButton } from '@/components/loading-button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/components/ui/use-toast';
import { useOrganization } from '@clerk/nextjs';

const formSchema = z.object({
  text: z.string().min(1).max(1000),
});

export const CreateNoteForm = ({
  onNoteCreated,
}: {
  onNoteCreated: () => void;
}) => {
  const createNote = useMutation(api.notes.createNote);

  const { toast } = useToast();
  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      text: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await createNote({ ...values, orgId: organization?.id });
    onNoteCreated();
    toast({
      title: 'Note created',
      description: 'Your note has been created successfully.',
    });
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Note</FormLabel>
              <FormControl>
                <Textarea
                  rows={8}
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
