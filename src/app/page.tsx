'use client';

import { api } from '@/convex/_generated/api';
import { useQuery } from 'convex/react';
import { DocumentCard } from './document-card';
import { UploadDocumentButton } from './upload-document-button';

const HomePage = () => {
  const documents = useQuery(api.documents.getDocuments);
  return (
    <main>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">My Documents</h1>
        <UploadDocumentButton />
      </div>
      <div className="grid grid-cols-3 gap-8">
        {documents?.map((doc) => <DocumentCard key={doc._id} document={doc} />)}
      </div>
    </main>
  );
};

export default HomePage;
