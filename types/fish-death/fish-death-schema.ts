import { z } from 'zod';

export const FishDeathSchema = z.object({
  fish_death_count: z
    .number({
      invalid_type_error: 'Jumlah kematian ikan harus berupa angka',
    })
    .int({ message: 'Jumlah kematian ikan harus bilangan bulat' })
    .min(1, { message: 'Minimal 1 ekor' })
    .optional(),
});

export type FishDeathInputForm = z.infer<typeof FishDeathSchema>;
