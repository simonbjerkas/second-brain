'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { ChatPanel } from './chat-panel';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PageSkeleton } from './page-skeleton';
import { DeleteDocumentButton } from './delete-document-button';
import { useParams } from 'next/navigation';
import {
  Breadcrumb,
  BreadcrumbEllipsis,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { DropdownMenu } from '@radix-ui/react-dropdown-menu';
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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
            <h1 className="text-2xl md:text-4xl font-bold md:pb-8">
              {document.title}
            </h1>
            <DeleteDocumentButton documentId={document._id} />
          </div>
          <Breadcrumb className="md:hidden pb-2">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/">Home</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-1">
                    <BreadcrumbEllipsis className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start">
                    <DropdownMenuItem>Dashboard</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="/dashboard/documents">
                  Documents
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href={`/dashboard/documents/${document._id}`}>
                  {document.title.substring(0, 8) + '...'}
                </BreadcrumbLink>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <Tabs defaultValue="document">
            <TabsList>
              <TabsTrigger value="document">Document</TabsTrigger>
              <TabsTrigger value="chat">Chat</TabsTrigger>
            </TabsList>
            <TabsContent value="document">
              <div className="bg-secondary p-4 rounded flex-1 h-[450px] md:h-[500]">
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
