'use client';

import { PondQualityInput, PondQualitySchema } from '@/types/pond-quality';
import React, { useState } from 'react';
import { useForm, Path } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addOrUpdatePondQuality } from '@/lib/pond-quality';
import { objectToFormData } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { X } from 'lucide-react';

interface PondQualityFormProps {
  setIsModalOpen: (open: boolean) => void;
  pondId?: string;
  cycleId?: string;
}

const PondQualityForm: React.FC<PondQualityFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PondQualityInput>({
    resolver: zodResolver(PondQualitySchema),
    defaultValues: {
      ph_level: 0,
      salinity: 0,
      water_temperature: 0,
      water_clarity: 0,
      water_circulation: 0,
      dissolved_oxygen: 0,
      orp: 0,
      ammonia: 0,
      nitrate: 0,
      phosphate: 0,
    }
  });

  const onSubmit = async (data: PondQualityInput) => {
    const dataWithImage = {
      ...data,
      image: "", // ⬅️ fix agar backend tidak error
    };

    try {
      const res = await addOrUpdatePondQuality(objectToFormData(dataWithImage), pondId, cycleId);
      if (res.success) {
        reset();
        setIsModalOpen(false);
        window.location.reload();
      } else {
        setError('Gagal menyimpan kualitas air');
      }
    } catch (err) {
      console.error(err);
      setError('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    }
  };

  return (
    <div className="bg-[#F1F5FF] p-5 rounded-lg w-full max-w-md mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2154C5] font-semibold text-base">Tambah Data Kualitas Air</h2>
        <button onClick={() => setIsModalOpen(false)} aria-label="Tutup">
          <X className="text-[#2154C5] w-5 h-5" />
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-2 gap-4">
          {/* Kolom Kiri */}
          <div className="space-y-4">
            {renderField<PondQualityInput>("Temperatur (°C)", "water_temperature", register, errors)}
            {renderField<PondQualityInput>("pH (0-14)", "ph_level", register, errors)}
            {renderField<PondQualityInput>("Kejernihan Air (NTU)", "water_clarity", register, errors)}
            {renderField<PondQualityInput>("Oksigen Terlarut (mg/L)", "dissolved_oxygen", register, errors)}
            {renderField<PondQualityInput>("Salinitas (PSU)", "salinity", register, errors)}
          </div>

          {/* Kolom Kanan */}
          <div className="space-y-4">
            {renderField<PondQualityInput>("Ammonia (mg/L)", "ammonia", register, errors)}
            {renderField<PondQualityInput>("Sirkulasi Air (L/menit)", "water_circulation", register, errors)}
            {renderField<PondQualityInput>("Phosphate (mg/L)", "phosphate", register, errors)}
            {renderField<PondQualityInput>("ORP (mV)", "orp", register, errors)}
            {renderField<PondQualityInput>("Nitrate (mg/L)", "nitrate", register, errors)}
          </div>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

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

function renderField<T extends Record<string, any>>(
  label: string,
  name: keyof T,
  register: ReturnType<typeof useForm<T>>["register"],
  errors: ReturnType<typeof useForm<T>>["formState"]["errors"]
) {
  return (
    <div>
      <Label className="text-sm text-[#2154C5]" htmlFor={String(name)}>
        {label}
      </Label>
      <Input
        id={String(name)}
        {...register(name as Path<T>, { setValueAs: value => parseFloat(value) })}
        type="number"
        className="bg-[#E7E7E7] mt-1"
        step={0.01}
      />
      {errors[name] && (
        <p className="text-sm text-red-500 mt-1">{(errors[name] as any)?.message}</p>
      )}
    </div>
  );
}

export default PondQualityForm;
