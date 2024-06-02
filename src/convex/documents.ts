import { ConvexError, v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from './_generated/server';
import { internal } from './_generated/api';
import { Id } from './_generated/dataModel';
import { hasOrgAccess } from './memberships';

export async function hasAccessToDocument(
  ctx: MutationCtx | QueryCtx,
  documentId: Id<'documents'>
) {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return null;
  }

  const document = await ctx.db.get(documentId);

  if (!document) {
    return null;
  }

  if (document.orgId) {
    const hasAccess = await hasOrgAccess(ctx, document.orgId);

    if (!hasAccess) {
      return null;
    }
  } else {
    if (document.tokenIdentifier !== userId) {
      return null;
    }
  }

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
      orgId = args.orgId;
      const isMember = await hasOrgAccess(ctx, orgId);
      if (!isMember) {
        throw new ConvexError('Unauthorized');
      }
    }
    const documentId = await ctx.db.insert('documents', {
      title: args.title,
      tokenIdentifier,
      storageId: args.storageId,
      orgId,
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
  args: {
    orgId: v.optional(v.string()),
  },
  async handler(ctx, args) {
    const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

    if (!userId) {
      return undefined;
    }

    if (args.orgId) {
      const isMember = await hasOrgAccess(ctx, args.orgId);
      if (!isMember) {
        return undefined;
      }

      return await ctx.db
        .query('documents')
        .withIndex('by_orgId', (q) => q.eq('orgId', args.orgId))
        .collect();
    } else {
      return await ctx.db
        .query('documents')
        .withIndex('by_tokenIdentifier', (q) => q.eq('tokenIdentifier', userId))
        .collect();
    }
  },
});

export const getDocument = query({
  args: {
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObj = await hasAccessToDocument(ctx, args.documentId);

    if (!accessObj) {
      return null;
    }

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
