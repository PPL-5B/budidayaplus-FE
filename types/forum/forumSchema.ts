import { z } from 'zod';

export const ForumSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  // parent_id is optional; if not provided, the post is a top-level forum post.
  parent_id: z.string().nullable().optional(),
});

export type ForumInput = z.infer<typeof ForumSchema>;
