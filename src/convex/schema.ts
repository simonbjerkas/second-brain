import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';
import { title } from 'process';

export default defineSchema({
  documents: defineTable({
    title: v.string(),
    tokenIdentifier: v.string(),
    description: v.optional(v.string()),
    storageId: v.id('_storage'),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
  chats: defineTable({
    documentId: v.id('documents'),
    tokenIdentifier: v.string(),
    isHuman: v.boolean(),
    text: v.string(),
  }).index('by_documentId_tokenIdentifier', ['documentId', 'tokenIdentifier']),
  notes: defineTable({
    title: v.string(),
    content: v.string(),
    tokenIdentifier: v.string(),
    description: v.optional(v.string()),
  }).index('by_tokenIdentifier', ['tokenIdentifier']),
});
