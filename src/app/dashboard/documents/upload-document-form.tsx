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
import { Id } from '@/convex/_generated/dataModel';
import { useOrganization } from '@clerk/nextjs';

const formSchema = z.object({
  title: z.string().min(1).max(250),
  file: z.instanceof(File),
});

export const UploadDocumentForm = ({ onUpload }: { onUpload: () => void }) => {
  const createDocument = useMutation(api.documents.createDocument);
  const generateUploadUrl = useMutation(api.documents.generateUploadUrl);
  const { organization } = useOrganization();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const uploadUrl = await generateUploadUrl();

    const result = await fetch(uploadUrl, {
      method: 'POST',
      headers: { 'Content-Type': values.file.type },
      body: values.file,
    });

    const { storageId } = await result.json();

    await createDocument({
      title: values.title,
      storageId: storageId as Id<'_storage'>,
      orgId: organization?.id,
    });

    onUpload();
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
          name="file"
          render={({ field: { value, onChange, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".txt,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx"
                  {...fieldProps}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      onChange(file);
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <LoadingButton
          isLoading={form.formState.isSubmitting}
          loadingText="Uploading"
        >
          Upload
        </LoadingButton>
      </form>
    </Form>
  );
};
