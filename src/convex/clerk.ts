'use node';

import { v } from 'convex/values';
import { internalAction } from './_generated/server';
import { Webhook } from 'svix';
import { WebhookEvent } from '@clerk/nextjs/server';

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET || '';

export const fulfill = internalAction({
  args: {
    headers: v.any(),
    payload: v.string(),
  },
  async handler(_, args) {
    const wh = new Webhook(webhookSecret);
    const payload = wh.verify(args.payload, args.headers);
    return payload as WebhookEvent;
  },
});
