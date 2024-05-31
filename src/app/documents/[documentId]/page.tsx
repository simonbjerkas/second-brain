'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';

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
      <div className="flex justify-between items-center pb-12">
        <h1 className="text-4xl font-bold">{document.title}</h1>
      </div>
      <div className="flex">
        <div className="bg-secondary p-4 rounded">
          {document.documentUrl && <iframe src={document.documentUrl} />}
        </div>
      </div>
    </main>
  );
};

export default DocumentPage;
