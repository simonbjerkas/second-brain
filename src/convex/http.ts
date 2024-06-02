import { httpRouter } from 'convex/server';
import { httpAction } from './_generated/server';
import { internal } from './_generated/api';

const http = httpRouter();

http.route({
  path: '/clerk',
  method: 'POST',
  handler: httpAction(async ({ runAction, runMutation }, req) => {
    const payloadString = await req.text();
    const headerPayload = req.headers;

    try {
      const result = await runAction(internal.clerk.fulfill, {
        payload: payloadString,
        headers: {
          'svix-id': headerPayload.get('svix-id'),
          'svix-timestamp': headerPayload.get('svix-timestamp'),
          'svix-signature': headerPayload.get('svix-signature'),
        },
      });

      switch (result.type) {
        case 'organizationMembership.created':
          await runMutation(internal.memberships.createMembership, {
            userId: `${process.env.CLERK_HOST_NAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
          });
          break;

        case 'organizationMembership.deleted':
          await runMutation(internal.memberships.deleteMembership, {
            userId: `${process.env.CLERK_HOST_NAME}|${result.data.public_user_data.user_id}`,
            orgId: result.data.organization.id,
          });
      }

      return new Response(null, { status: 200 });
    } catch (err) {
      return new Response('Webhook Error', { status: 400 });
    }
  }),
});

export default http;
