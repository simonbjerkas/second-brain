import OpenAI from 'openai';
import { action, internalAction } from './_generated/server';
import { ConvexError, v } from 'convex/values';
import { internal } from './_generated/api';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateDocumentDescription = internalAction({
  args: {
    storageId: v.id('_storage'),
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const file = await ctx.storage.get(args.storageId);

    if (!file) throw new ConvexError('File not found');

    const text = (await file.text()) as string;

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Here is a text file: ${text}`,
        },
        {
          role: 'user',
          content: `Please generate a 1 sentence description for this document.`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const response =
      chatCompletion.choices[0].message.content ||
      'Could not figure out description for this document.';

    await ctx.runMutation(internal.documents.updateDocumentDescription, {
      documentId: args.documentId,
      description: response,
    });

    return response;
  },
});

export const askQuestion = action({
  args: {
    question: v.string(),
    documentId: v.id('documents'),
  },
  async handler(ctx, args) {
    const accessObj = await ctx.runQuery(
      internal.documents.hasAccessToDocumentQuery,
      { documentId: args.documentId }
    );
    if (!accessObj)
      throw new ConvexError('You do not have access to this document');

    const file = await ctx.storage.get(accessObj.document.storageId);

    if (!file) throw new ConvexError('Document not found');

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: args.question,
      isHuman: true,
      tokenIdentifier: accessObj.userId,
    });

    const text = (await file.text()) as string;

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `Here is a text file: ${text}`,
        },
        {
          role: 'user',
          content: `Please answer this question: ${args.question}`,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const response =
      chatCompletion.choices[0].message.content ||
      'No response, please try again.';

    await ctx.runMutation(internal.chats.createChatRecord, {
      documentId: args.documentId,
      text: response,
      isHuman: false,
      tokenIdentifier: accessObj.userId,
    });

    return response;
  },
});
