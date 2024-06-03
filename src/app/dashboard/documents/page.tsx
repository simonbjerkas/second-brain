'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { DocumentCard } from './document-card';
import { UploadDocumentButton } from './upload-document-button';
import { DocumentCardSkeleton } from './document-card-skeleton';
import Image from 'next/image';
import { useOrganization } from '@clerk/nextjs';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Skeleton } from '@/components/ui/skeleton';

const DocumentsPage = () => {
  const { organization } = useOrganization();
  const documents = useQuery(api.documents.getDocuments, {
    orgId: organization?.id,
  });
  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2 pb-12">
        <h1 className="text-3xl md:text-4xl font-bold">My Documents</h1>
        <Breadcrumb className="md:hidden my-2">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard/documents">
                Documents
              </BreadcrumbLink>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
        {documents && documents.length === 0 ? (
          documents === undefined && <Skeleton className="w-44 h-10" />
        ) : (
          <UploadDocumentButton />
        )}
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {!documents
          ? Array.from({ length: 6 }).map((_, i) => (
              <DocumentCardSkeleton key={i} />
            ))
          : documents?.map((doc) => (
              <DocumentCard key={doc._id} document={doc} />
            ))}
      </div>
      {documents && documents.length === 0 && (
        <div className="flex flex-col justify-center items-center gap-8 py-12">
          <Image src="/text_files.svg" alt="" width={300} height={300} />
          <h2 className="text-2xl font-semibold">You have no documents.</h2>
          <UploadDocumentButton />
        </div>
      )}
    </>
  );
};

export default DocumentsPage;
