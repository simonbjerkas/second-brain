'use client';

import { Button } from '@/components/ui/button';
import { api } from '@/convex/_generated/api';
import { useMutation, useQuery } from 'convex/react';
import { DocumentCard } from './document-card';
import { CreateDocumentButton } from './create-document-button';

const HomePage = () => {
  const documents = useQuery(api.documents.getDocuments);
  const createDocument = useMutation(api.documents.createDocument);
  return (
    <main>
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">Documents</h1>
        <CreateDocumentButton />
      </div>
      <div className="grid grid-cols-3 gap-8">
        {documents?.map((doc) => <DocumentCard key={doc._id} document={doc} />)}
      </div>
    </main>
  );
};

export default HomePage;
