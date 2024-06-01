'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { ChatPanel } from './chat-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageSkeleton } from './page-skeleton';

const DocumentPage = ({
  params,
}: {
  params: { documentId: Id<'documents'> };
}) => {
  const document = useQuery(api.documents.getDocument, {
    documentId: params.documentId,
  });

  return (
    <main>
      {!document && <PageSkeleton />}
      {document && (
        <>
          <h1 className="text-4xl font-bold pb-8">{document.title}</h1>
          <Tabs defaultValue="document">
            <TabsList>
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="document">
              <div className="bg-secondary p-4 rounded flex-1 h-[500px]">
                {document.documentUrl && (
                  <iframe
                    className="w-full h-full"
                    src={document.documentUrl}
                  />
                )}
              </div>
            </TabsContent>
            <TabsContent value="chat">
              <ChatPanel documentId={params.documentId} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  );
};

export default DocumentPage;
