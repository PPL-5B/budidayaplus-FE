'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

import { addFishDeath } from '@/lib/fish-death/addFishDeath';
import FishDeathWarningPopUp from './FishDeathWarningPopUp';

interface AddFishDeathFormProps {
  pondId: string;
  cycleId: string;
  setIsModalOpen: (open: boolean) => void;
}

interface FishDeathInput {
  fish_death_count: number;
}

const AddFishDeathForm: React.FC<AddFishDeathFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const [warningMessage, setWarningMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FishDeathInput>({
    defaultValues: {
      fish_death_count: 0,
    },
  });

  const onSubmit = async (data: FishDeathInput) => {
    try {
      setWarningMessage(null);
      const res = await addFishDeath(pondId, cycleId, data.fish_death_count);

      if (!res.success && res.message) {
        setWarningMessage(res.message);
        return;
      }

      reset();
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      if (error instanceof Error) {
        const serverError = error as {
          response?: {
            data?: {
              detail?: string;
            };
          };
        };
        const message = serverError?.response?.data?.detail ?? 'Terjadi kesalahan saat menyimpan data.';
        setWarningMessage(message);
      } else {
        setWarningMessage('Terjadi kesalahan yang tidak diketahui.');
      }
    }
  };

  return (
    <div className="bg-[#F1F5FF] p-5 rounded-lg w-full max-w-xs mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2154C5] font-semibold text-base">Tambah Kematian Ikan</h2>
        <button onClick={() => setIsModalOpen(false)} aria-label="Tutup">
          <X className="text-[#2154C5] w-5 h-5" />
        </button>
      </div>

      {warningMessage && (
        <FishDeathWarningPopUp
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
        />
      )}

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)} noValidate>
        <div>
          <Label className="text-sm text-[#2154C5]" htmlFor="fish_death_count">
            Jumlah Ikan Mati
          </Label>
          <Input
            id="fish_death_count"
            {...register('fish_death_count', { valueAsNumber: true })}
            type="number"
            step={1}
            className="mt-1 bg-[#E7E7E7]"
            aria-invalid={!!errors.fish_death_count}
          />
          {errors.fish_death_count && (
            <p role="alert" className="text-red-500 text-sm mt-1">
              {errors.fish_death_count.message}
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

export default AddFishDeathForm;