'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addFishSampling } from '@/lib/fish-sampling';
import { Label } from '@/components/ui/label';

interface FishSamplingFormProps {
  setIsModalOpen: (open: boolean) => void;
  pondId: string;
  cycleId: string;
}

interface FishSamplingInputForm {
  fish_weight: number;
  fish_length: number;
}

const FishSamplingForm: React.FC<FishSamplingFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const [error, setError] = useState<string | null>(null);
  const [warning, setWarning] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FishSamplingInputForm>();

  const onSubmit = async (data: FishSamplingInputForm) => {
    try {
      setError(null);
      setWarning(null);
  
      // Validasi manual sebelum mengirim request
      if (data.fish_weight <= 0 || data.fish_length <= 0) {
        setError("Berat dan panjang ikan harus lebih dari 0, harap pastikan data benar.");
        return;
      }
      if (data.fish_weight > 10 && data.fish_length > 100) {
        setError("Berat dan panjang ikan terlalu besar, harap pastikan data benar.");
        return;
      }
      if (data.fish_weight > 10) {
        setError("Berat ikan lebih dari 10 kg, harap pastikan data benar.");
        return;
      }
      if (data.fish_length > 100) {
        setError("Panjang ikan lebih dari 100 cm, harap pastikan data benar.");
        return;
      }
  
      // Konversi manual ke FormData
      const formData = new FormData();
      formData.append("fish_weight", data.fish_weight.toString());
      formData.append("fish_length", data.fish_length.toString());
  
      const res = await addFishSampling(pondId, cycleId, formData);
  
      if (!res.success) {
        setError(res.message ?? "Gagal menyimpan sample ikan");
        return;
      }
  
      if (res.warning) {
        setWarning(res.warning);
      } else {
        reset();
        setIsModalOpen(false);
        window.location.reload();
      }
    } catch (error) {
      setError("Gagal menyimpan sample ikan");
    }
  };

  return (
    <div>
      {/* Pop-up Modal untuk Error */}
      {error && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-red-600 text-2xl">❌</span>
              <h2 className="text-lg font-semibold text-red-600 leading-tight">Kesalahan Input</h2>
            </div>
            <p className="mt-2">{error}</p>
            <Button className="mt-4 bg-red-500 hover:bg-red-700 px-4 py-2" onClick={() => setError(null)}>
              Perbaiki Input
            </Button>
          </div>
        </div>
      )}

      {/* Pop-up Modal untuk Warning */}
      {warning && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
            <div className="flex items-center justify-center gap-2">
              <span className="text-yellow-600 text-2xl">⚠️</span>
              <h2 className="text-lg font-semibold text-yellow-600 leading-tight">Peringatan</h2>
            </div>
            <p className="mt-2">{warning}</p>
            <Button className="mt-4 bg-yellow-500 hover:bg-yellow-700 px-4 py-2" onClick={() => setWarning(null)}>
              Oke, Saya Mengerti
            </Button>
          </div>
        </div>
      )}

      {/* Form Input */}
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label className="text-sm" htmlFor="fish_weight">Berat Ikan (kg)</Label>
          <Input
            {...register('fish_weight', { setValueAs: value => parseFloat(value) })}
            type="number"
            placeholder="Berat Ikan (kg)"
            step={0.01}
          />
        </div>

        <div>
          <Label className="text-sm" htmlFor="fish_length">Panjang Ikan (cm)</Label>
          <Input
            {...register('fish_length', { setValueAs: value => parseFloat(value) })}
            type="number"
            placeholder="Panjang Ikan (cm)"
            step={0.01}
          />
        </div>

        <Button className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 col-span-2" type="submit" disabled={isSubmitting}>
          Simpan
        </Button>
      </form>
    </div>
  );
};

export default FishSamplingForm;