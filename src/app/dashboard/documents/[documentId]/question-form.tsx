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
import { Id } from '@/convex/_generated/dataModel';
import { useOrganization } from '@clerk/nextjs';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAction } from 'convex/react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

const formSchema = z.object({
  question: z.string().min(1).max(250),
});

export const QuestionForm = ({
  documentId,
}: {
  documentId: Id<'documents'>;
}) => {
  const askQuestion = useAction(api.openAI.askQuestion);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      question: '',
    },
  });
  const { organization } = useOrganization();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    await askQuestion({
      question: values.question,
      documentId,
      orgId: organization?.id,
    });
    form.reset();
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
        <FormField
          control={form.control}
          name="question"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  placeholder="Ask any question over this document"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton isLoading={form.formState.isSubmitting} loadingText="">
          Ask
        </LoadingButton>
      </form>
    </Form>
  );
};
