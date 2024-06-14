'use client';

import { api } from '@/convex/_generated/api';
import { Id } from '@/convex/_generated/dataModel';
import { useQuery } from 'convex/react';
import { Message } from './message';
import { QuestionForm } from './question-form';

export const ChatPanel = ({ documentId }: { documentId: Id<'documents'> }) => {
  const chatRecords = useQuery(api.chats.getChatForDocument, { documentId });
  return (
    <div className="bg-secondary rounded flex flex-col gap-4 justify-between p-4 h-[65vh]">
      <div className="overflow-y-auto">
        <div className="flex flex-col-reverse gap-6">
          {chatRecords?.map((chat) => (
            <Message key={chat._id} text={chat.text} isHuman={chat.isHuman} />
          ))}
          <Message text="Hello, how can I help you?" isHuman={false} />
        </div>
      </div>
      <QuestionForm documentId={documentId} />
    </div>
  );
};
