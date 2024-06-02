import { Id } from './_generated/dataModel';
import {
  MutationCtx,
  QueryCtx,
  internalAction,
  internalMutation,
  mutation,
  query,
} from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { embed } from './openAI';
import { internal } from './_generated/api';

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

export const createNoteEmbedding = internalAction({
  args: {
    noteId: v.id('notes'),
    text: v.string(),
  },
  async handler(ctx, args) {
    const embedding = await embed(args.text);

    await ctx.runMutation(internal.notes.setNoteEmbeding, {
      embedding,
      noteId: args.noteId,
    });
  },
});

export const setNoteEmbeding = internalMutation({
  args: {
    noteId: v.id('notes'),
    embedding: v.array(v.float64()),
  },
  async handler(ctx, args) {
    await ctx.db.patch(args.noteId, { embedding: args.embedding });
  },
});

export const createNote = mutation({
  args: {
    text: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }

    const noteId = await ctx.db.insert('notes', {
      text: args.text,
      tokenIdentifier: userId,
    });

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId,
      text: args.text,
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

export const deleteNote = mutation({
  args: {
    noteId: v.id('notes'),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToNote(ctx, args.noteId);
    if (!accessObj) {
      throw new ConvexError('Unauthorized');
    }
    await ctx.db.delete(accessObj.note._id);
  },
});
