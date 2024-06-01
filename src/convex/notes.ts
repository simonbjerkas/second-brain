import { internal } from './_generated/api';
import { internalMutation, mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

export const createNote = mutation({
  args: {
    title: v.string(),
    content: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }
    const noteId = await ctx.db.insert('notes', {
      title: args.title,
      content: args.content,
      tokenIdentifier: userId,
    });

    await ctx.scheduler.runAfter(0, internal.openAI.generateNoteDescription, {
      noteId,
      content: args.content,
    });
  },
});

export const updateNoteDescription = internalMutation({
  args: {
    noteId: v.id('notes'),
    description: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.noteId, { description: args.description });
  },
});

export const getNotes = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }
    return await ctx.db
      .query('notes')
      .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
      .order('desc')
      .collect();
  },
});
