import { z } from 'zod';


export const FishDeathSchema = z.object({
  fish_death_count: z.number().positive('Kuantitas ikan mati harus berupa angka positif'),
});


export type FishDeathInput = z.infer<typeof FishDeathSchema>;

