import { v } from 'convex/values';
import { internalMutation, query } from './_generated/server';
import { hasOrgAccess } from './memberships';

export const createChatRecord = internalMutation({
  args: {
    documentId: v.id('documents'),
    text: v.string(),
    isHuman: v.boolean(),
    tokenIdentifier: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert('chats', {
      documentId: args.documentId,
      text: args.text,
      isHuman: args.isHuman,
      tokenIdentifier: args.tokenIdentifier,
    });
  },
});

export const getChatForDocument = query({
  args: {
    documentId: v.id('documents'),
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return [];

    let isMember = true;
    if (args.orgId) {
      isMember = await hasOrgAccess(ctx, args.orgId);
    }
    if (!isMember) return [];

    return await ctx.db
      .query('chats')
      .withIndex('by_documentId_tokenIdentifier', (q) =>
        q.eq('documentId', args.documentId).eq('tokenIdentifier', userId)
      )
      .order('desc')
      .collect();
  },
});
