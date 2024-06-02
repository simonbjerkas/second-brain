import { ConvexError, v } from 'convex/values';
import { action } from './_generated/server';
import { embed } from './openAI';
import { api } from './_generated/api';
import { Doc } from './_generated/dataModel';

export const searchAction = action({
  args: {
    search: v.string(),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;

    const embedding = await embed(args.search);

    const results = await ctx.vectorSearch('notes', 'by_embedding', {
      vector: embedding,
      limit: 16,
      filter: (q) => q.eq('tokenIdentifier', userId),
    });

    const records: (
      | { record: Doc<'notes'>; type: 'note' }
      | { record: Doc<'documents'>; type: 'document' }
    )[] = [];

    await Promise.all(
      results.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
          noteId: result._id,
        });
        if (!note) return null;
        records.push({ record: note, type: 'note' });
      })
    );

    return records;
  },
});
