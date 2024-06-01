'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { DocumentCard } from './document-card';
import { UploadDocumentButton } from './upload-document-button';
import { DocumentCardSkeleton } from './document-card-skeleton';
import Image from 'next/image';

const HomePage = () => {
  const documents = useQuery(api.documents.getDocuments);
  return (
    <main>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">My Documents</h1>
        {documents && documents.length > 0 && <UploadDocumentButton />}
      </div>
      <div className="grid grid-cols-3 gap-8">
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
          <Image src="./text_files.svg" alt="" width={300} height={300} />
          <h2 className="text-2xl font-semibold">You have no documents.</h2>
          <UploadDocumentButton />
        </div>
      )}
    </main>
  );
};

export default HomePage;
