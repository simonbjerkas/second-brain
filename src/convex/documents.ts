import { ConvexError, v } from 'convex/values';
import { mutation, query } from './_generated/server';

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
    await ctx.db.insert('documents', {
      title: args.title,
      tokenIdentifier: userId,
      storageId: args.storageId,
    });
  },
});

export const getDocuments = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return [];
    return await ctx.db
      .query('documents')
      .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
      .collect();
  },
});

export const getDocument = query({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;

    const document = await ctx.db.get(args.documentId);

    if (!document || document?.tokenIdentifier !== userId) return null;
    return {
      ...document,
      documentUrl: await ctx.storage.getUrl(document.storageId),
    };
  },
});
