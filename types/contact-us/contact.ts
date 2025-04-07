// types/contact.ts
import { z } from 'zod';

export const ContactFormSchema = z.object({
  name: z.string().min(1, { message: "Nama harus diisi" }),
  phone_number: z.string().min(10, { message: "Nomor WhatsApp tidak valid" }),
  message: z.string().min(1, { message: "Pesan harus diisi" })
});

export type ContactFormInput = z.infer<typeof ContactFormSchema>;