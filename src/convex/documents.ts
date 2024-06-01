import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import { internal } from './_generated/api';
import OpenAI from 'openai';
import { Id } from './_generated/dataModel';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<'documents'>
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  if (!userId) return null;

  const document = await ctx.db.get(documentId);

  if (!document || document?.tokenIdentifier !== userId) return null;

  return { document, userId };
}

export const hasAccessToDocumentQuery = internalQuery({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    return await hasAccessToDocument(ctx, args.documentId);
  },
});

export const generateUploadUrl = mutation(
  async (ctx) => await ctx.storage.generateUploadUrl()
);

export const createDocument = mutation({
  args: {
    title: v.string(),
    storageId: v.id('_storage'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }
    const documentId = await ctx.db.insert('documents', {
      title: args.title,
      tokenIdentifier: userId,
      storageId: args.storageId,
    });

    await ctx.scheduler.runAfter(
      0,
      internal.documents.generateDocumentDescription,
      {
        storageId: args.storageId,
        documentId,
      }
    );
  },
});

export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return undefined;
    return await ctx.db
      .query('documents')
      .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
      .order('desc')
      .collect();
  },
});

export const getDocument = query({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);
    if (!accessObj) return null;
    return {
      ...accessObj.document,
      documentUrl: await ctx.storage.getUrl(accessObj.document.storageId),
    };
  },
});

export const updateDocumentDescription = internalMutation({
  args: {
    documentId: v.id('documents'),
    description: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      description: args.description,
    });
  },
});

export const generateDocumentDescription = internalAction({
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

    const response =
      chatCompletion.choices[0].message.content ||
      'Could not figure out description for this document.';

    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      description: response,
    });

    return response;
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id('documents'),
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
