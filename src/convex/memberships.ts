import { v } from 'convex/values';
import {
  MutationCtx,
  QueryCtx,
  internalMutation,
  internalQuery,
} from './_generated/server';

export const hasOrgAccess = async (
  ctx: MutationCtx | QueryCtx,
  orgId: string
) => {
  const userId = (await ctx.auth.getUserIdentity())?.tokenIdentifier;

  if (!userId) {
    return false;
  }

  const membership = await ctx.db
    .query('memberships')
    .withIndex('by_orgId_userId', (q) =>
      q.eq('orgId', orgId).eq('userId', userId)
    )
    .first();

  return !!membership;
};

export const hasOrgAccessQuery = internalQuery({
  args: {
    orgId: v.string(),
  },
  async handler(ctx, args) {
    return await hasOrgAccess(ctx, args.orgId);
  },
});

export const createMembership = internalMutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  async handler(ctx, args) {
    await ctx.db.insert('memberships', {
      orgId: args.orgId,
      userId: args.userId,
    });
  },
});

export const deleteMembership = internalMutation({
  args: {
    orgId: v.string(),
    userId: v.string(),
  },
  async handler(ctx, args) {
    const membership = await ctx.db
      .query('memberships')
      .withIndex('by_orgId_userId', (q) =>
        q.eq('orgId', args.orgId).eq('userId', args.userId)
      )
      .first();
    if (membership) await ctx.db.delete(membership._id);
  },
});
