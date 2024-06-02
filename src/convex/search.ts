import { v } from 'convex/values';
import { action } from './_generated/server';
import { embed } from './openAI';
import { api, internal } from './_generated/api';
import { Doc } from './_generated/dataModel';

export const searchAction = action({
  args: {
    search: v.string(),
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;
    if (!userId) return null;
    if (args.orgId) {
      const isMember = await ctx.runQuery(
        internal.memberships.hasOrgAccessQuery,
        { orgId: args.orgId }
      );
      if (!isMember) return null;
    }

    const embedding = await embed(args.search);

    // const filter = args.orgId
    //   ? (q: any) => q.eq('orgId', args.orgId)
    //   : (q: any) => q.eq('tokenIdentifier', userId);

    const notesResults = await ctx.vectorSearch('notes', 'by_embedding', {
      vector: embedding,
      limit: 5,
      filter: (q) => q.eq('orgId', args.orgId),
    });

    console.log('notesResults', notesResults);

    const documentsResults = await ctx.vectorSearch(
      'documents',
      'by_embedding',
      {
        vector: embedding,
        limit: 5,
        filter: (q) => q.eq('orgId', args.orgId),
      }
    );

    const records: (
      | { record: Doc<'notes'>; score: number; type: 'note' }
      | { record: Doc<'documents'>; score: number; type: 'document' }
    )[] = [];

    await Promise.all(
      notesResults.map(async (result) => {
        const note = await ctx.runQuery(api.notes.getNote, {
          noteId: result._id,
        });
        if (!note) return;
        records.push({ record: note, score: result._score, type: 'note' });
      })
    );

    await Promise.all(
      documentsResults.map(async (result) => {
        const document = await ctx.runQuery(api.documents.getDocument, {
          documentId: result._id,
        });
        if (!document) return null;
        records.push({
          record: document,
          score: result._score,
          type: 'document',
        });
      })
    );

    records.sort((a, b) => b.score - a.score);

    return records;
  },
});
