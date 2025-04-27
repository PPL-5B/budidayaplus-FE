import { z } from 'zod';

export const ForumSchema = z.object({
  title: z.string().optional(), 
  description: z.string().min(1, 'Description is required'), 
  tag: z.enum(["ikan", "kolam", "siklus", "budidayaplus"]), 
  parent_id: z.string().uuid().nullable().optional(), 
});

export type ForumInput = z.infer<typeof ForumSchema>;
