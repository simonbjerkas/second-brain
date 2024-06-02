import OpenAI from 'openai';
import { action, internalAction } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDocumentDescriptionAndEmbedding = internalAction({
  args: {
    storageId: v.id('_storage'),
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const file = await ctx.storage.get(args.storageId);

    if (!file) throw new ConvexError('File not found');

    const text = (await file.text()) as string;

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Here is a text file: ${text}`,
        },
        {
          role: 'user',
          content: `Please generate a 1 sentence description for this document.`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const description =
      chatCompletion.choices[0].message.content ||
      'Could not figure out description for this document.';

    const embedding = await embed(description);

    await ctx.runMutation(
      internal.documents.updateDocumentDescriptionAndEmbedding,
      {
        documentId: args.documentId,
        description,
        embedding,
      }
    );

    return description;
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id('documents'),
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      { documentId: args.documentId }
    );
    if (!accessObj)
      throw new ConvexError('You do not have access to this document');

    const file = await ctx.storage.get(accessObj.document.storageId);

    if (!file) throw new ConvexError('Document not found');

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: accessObj.userId,
    });

    const text = (await file.text()) as string;

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Here is a text file: ${text}`,
        },
        {
          role: 'user',
          content: `Please answer this question: ${args.question}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const response =
      chatCompletion.choices[0].message.content ||
      'No response, please try again.';

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: response,
      isHuman: false,
      tokenIdentifier: accessObj.userId,
    });

    return response;
  },
});

export async function embed(text: string) {
  const response = await openai.embeddings.create({
    model: 'text-embedding-ada-002',
    input: text,
  });
  return response.data[0].embedding;
}
