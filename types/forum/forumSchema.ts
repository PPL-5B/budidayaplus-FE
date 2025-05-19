import { z } from 'zod';

export const ForumTagEnum = z.enum(['ikan', 'kolam', 'siklus', 'budidayaplus']);
export type ForumTag = z.infer<typeof ForumTagEnum>;

export const ForumSchema = z.object({
  title: z.string().min(1, 'Judul tidak boleh kosong'),
  description: z.string().min(1, 'Deskripsi tidak boleh kosong'),
  tag: ForumTagEnum,
  
  parent_id: z.string().nullable().optional(),
});

export type ForumInput = z.infer<typeof ForumSchema>;