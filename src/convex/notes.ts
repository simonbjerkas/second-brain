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
import { hasOrgAccess } from './memberships';
import { Doc } from './_generated/dataModel';

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
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) {
      throw new ConvexError('Unauthorized');
    }

    let orgId: string | undefined;
    const tokenIdentifier = args.orgId ? undefined : userId;

    if (args.orgId) {
      const isMember = await hasOrgAccess(ctx, args.orgId);
      if (!isMember) throw new ConvexError('Unauthorized');
      orgId = args.orgId;
    }

    const noteId = await ctx.db.insert('notes', {
      text: args.text,
      tokenIdentifier,
      orgId,
    });

    await ctx.scheduler.runAfter(0, internal.notes.createNoteEmbedding, {
      noteId,
      text: args.text,
    });
  },
});

export const getNotes = query({
  args: {
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    if (args.orgId) {
      const hasAccess = await hasOrgAccess(ctx, args.orgId);

      if (!hasAccess) {
        return null;
      }

      const notes = await ctx.db
        .query('notes')
        .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
        .collect();

      return notes;
    } else {
      const notes = await ctx.db
        .query('notes')
        .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
        .order('desc')
        .collect();

      return notes;
    }
  },
});

export const getNote = query({
  args: {
    noteId: v.id('notes'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return null;
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      return null;
    }

    if (note.orgId) {
      const hasAccess = await hasOrgAccess(ctx, note.orgId);

      if (!hasAccess) {
        return null;
      }
    } else {
      if (note.tokenIdentifier !== userId) {
        return null;
      }
    }

    return note;
  },
});

export const deleteNote = mutation({
  args: {
    noteId: v.id('notes'),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      throw new ConvexError('You must be logged in to create a note');
    }

    const note = await ctx.db.get(args.noteId);

    if (!note) {
      throw new ConvexError('Note not found');
    }

    await assertAccessToNote(ctx, note);

    await ctx.db.delete(args.noteId);
  },
});

async function assertAccessToNote(
  ctx: QueryCtx | MutationCtx,
  note: Doc<'notes'>
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    throw new ConvexError('You must be logged in to create a note');
  }

  if (note.orgId) {
    const hasAccess = await hasOrgAccess(ctx, note.orgId);

    if (!hasAccess) {
      throw new ConvexError('You do not have permission to delete this note');
    }
  } else {
    if (note.tokenIdentifier !== userId) {
      throw new ConvexError('You do not have permission to delete this note');
    }
  }
}
