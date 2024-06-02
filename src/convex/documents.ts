import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { embed } from './openAI';

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
      internal.openAI.generateDocumentDescriptionAndEmbedding,
      {
        storageId: args.storageId,
        documentId,
      }
    );
  },
});

export const deleteDocument = mutation({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);
    if (!accessObj) return;

    await ctx.storage.delete(accessObj.document.storageId);
    await ctx.db.delete(accessObj.document._id);
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

export const updateDocumentDescriptionAndEmbedding = internalMutation({
  args: {
    documentId: v.id('documents'),
    description: v.string(),
    embedding: v.array(v.float64()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.documentId, {
      description: args.description,
      embedding: args.embedding,
    });
  },
});
