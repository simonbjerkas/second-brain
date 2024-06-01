'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { ChatPanel } from './chat-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const DocumentPage = ({
  params,
}: {
  params: { documentId: Id<'documents'> };
}) => {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });
  if (!document) return <div>You don&apos;t have access to this document.</div>;
  return (
    <main>
      <div className="flex justify-between items-center pb-8">
        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>
      <Tabs defaultValue="document">
        <TabsList>
          <TabsTrigger value="document">Document</TabsTrigger>
          <TabsTrigger value="chat">Chat</TabsTrigger>
        </TabsList>
        <TabsContent value="document">
          <div className="bg-secondary p-4 rounded flex-1 h-[500px]">
            {document.documentUrl && (
              <iframe className="w-full h-full" src={document.documentUrl} />
            )}
          </div>
        </TabsContent>
        <TabsContent value="chat">
          <ChatPanel documentId={params.documentId} />
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default DocumentPage;
