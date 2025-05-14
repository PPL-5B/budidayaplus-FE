'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

import { addFishSampling } from '@/lib/fish-sampling';
import FishSamplingWarningPopup from './FishSamplingWarningPopUp';

interface FishSamplingFormProps {
  setIsModalOpen: (open: boolean) => void;
  pondId: string;
  cycleId: string;
}

const FishSamplingSchema = z.object({
  fish_weight: z
    .number({ invalid_type_error: 'Berat harus berupa angka positif' })
    .positive({ message: 'Berat harus berupa angka positif' }),
  fish_length: z
    .number({ invalid_type_error: 'Panjang harus berupa angka positif' })
    .positive({ message: 'Panjang harus berupa angka positif' }),
});

type FishSamplingInputForm = z.infer<typeof FishSamplingSchema>;

const FishSamplingForm: React.FC<FishSamplingFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const [customErrors, setCustomErrors] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FishSamplingInputForm>({
    resolver: zodResolver(FishSamplingSchema),
    defaultValues: {
      fish_weight: 0,
      fish_length: 0,
    },
  });

  const onSubmit = async (data: FishSamplingInputForm) => {
    const newErrors: string[] = [];

    if (data.fish_weight > 10) {
      newErrors.push('Berat ikan lebih dari 10 kg, harap pastikan data benar.');
    }

    if (data.fish_length > 100) {
      newErrors.push('Panjang ikan lebih dari 100 cm, harap pastikan data benar.');
    }

    if (newErrors.length > 0) {
      setCustomErrors(newErrors);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('fish_weight', data.fish_weight.toString());
      formData.append('fish_length', data.fish_length.toString());

      const res = await addFishSampling(pondId, cycleId, formData);

      if (!res.success) {
        setCustomErrors([`Gagal menyimpan sample ikan: ${res.message ?? ''}`]);
        return;
      }

      reset();
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Error while saving fish sampling:', error);
      setCustomErrors([
        'Gagal menyimpan sample ikan. Silakan coba lagi atau hubungi administrator.',
      ]);
    }
  };

  return (
    <div className="bg-[#F1F5FF] p-5 rounded-lg w-full max-w-xs mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2154C5] font-semibold text-base">Tambah Ukuran Ikan</h2>
        <button onClick={() => setIsModalOpen(false)} aria-label="Tutup">
          <X className="text-[#2154C5] w-5 h-5" />
        </button>
      </div>

      {customErrors.length > 0 && (
        <FishSamplingWarningPopup
          onClose={() => setCustomErrors([])}
          errorMessages={customErrors}
        />
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <Label className="text-sm text-[#2154C5]" htmlFor="fish_weight">
            Berat Ikan (kg)
          </Label>
          <Input
            id="fish_weight"
            {...register('fish_weight', { valueAsNumber: true })}
            type="number"
            step={0.01}
            className="mt-1 bg-[#E7E7E7]"
            aria-invalid={!!errors.fish_weight}
          />
          {errors.fish_weight && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {errors.fish_weight.message}
            </p>
          )}
        </div>

        <div>
          <Label className="text-sm text-[#2154C5]" htmlFor="fish_length">
            Panjang Ikan (cm)
          </Label>
          <Input
            id="fish_length"
            {...register('fish_length', { valueAsNumber: true })}
            type="number"
            step={0.01}
            className="mt-1 bg-[#E7E7E7]"
            aria-invalid={!!errors.fish_length}
          />
          {errors.fish_length && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {errors.fish_length.message}
            </p>
          )}
        </div>

        <Button
          className="w-full bg-[#2154C5] hover:bg-[#1A3F96] text-white font-medium rounded-md py-2"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>
    </div>
  );
};

export default FishSamplingForm;
