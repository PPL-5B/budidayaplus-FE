import { z } from 'zod';

export const FishSamplingSchema = z.object({
    fish_weight: z.number().positive({ message: 'Berat harus berupa angka positif' }),
    fish_length: z.number().positive({ message: 'Panjang harus berupa angka positif' }),
});

export type FishSamplingInputForm = z.infer<typeof FishSamplingSchema>;