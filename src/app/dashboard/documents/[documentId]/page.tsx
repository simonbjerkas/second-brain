'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { ChatPanel } from './chat-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageSkeleton } from './page-skeleton';
import { DeleteDocumentButton } from './delete-document-button';
import { useParams } from 'next/navigation';

const DocumentPage = () => {
  const { documentId } = useParams<{ documentId: Id<'documents'> }>();
  const document = useQuery(api.documents.getDocument, {
    documentId: documentId,
  });

  return (
    <>
      {!document && <PageSkeleton />}
      {document && (
        <>
          <div className="flex items-center justify-between">
            <h1 className="text-4xl font-bold pb-8">{document.title}</h1>
            <DeleteDocumentButton documentId={document._id} />
          </div>
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
              <ChatPanel documentId={documentId} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </>
  );
};

export default DocumentPage;
