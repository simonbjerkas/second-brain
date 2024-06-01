import { Id } from './_generated/dataModel';
import { MutationCtx, QueryCtx, mutation, query } from './_generated/server';
import { ConvexError, v } from 'convex/values';

export async function hasAccessToNote(
  ctx: MutationCtx | QueryCtx,
  noteId: Id<'notes'>
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
  if (!userId) return null;

  const note = await ctx.db.get(noteId);

  if (!note || note?.tokenIdentifier !== userId) return null;

  return { note, userId };
}

export const createNote = mutation({
  args: {
    text: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }
    await ctx.db.insert('notes', {
      text: args.text,
      tokenIdentifier: userId,
    });
  },
});

export const getNotes = query({
  async handler(ctx) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return undefined;
    return await ctx.db
      .query('notes')
      .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
      .order('desc')
      .collect();
  },
});

export const getNote = query({
  args: {
    noteId: v.id('notes'),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToNote(ctx, args.noteId);
    if (!accessObj) return null;
    return accessObj.note;
  },
});
