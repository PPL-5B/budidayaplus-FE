'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addFishSampling } from '@/lib/fish-sampling';
import { Label } from '@/components/ui/label';
import FishSamplingWarningPopup from './FishSamplingWarningPopUp';

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
  const [errors, setErrors] = useState<string[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [fishWeight, setFishWeight] = useState<number | null>(null);
  const [fishLength, setFishLength] = useState<number | null>(null);

  const {
    register,
    handleSubmit,
    formState: { isSubmitting },
    reset,
  } = useForm<FishSamplingInputForm>();

  const handleInputChange = (field: "fish_weight" | "fish_length", value: string) => {
    const numericValue = parseFloat(value);
    if (field === "fish_weight") {
      setFishWeight(numericValue);
    } else {
      setFishLength(numericValue);
    }
  };

  const onSubmit = async (data: FishSamplingInputForm) => {
    try {
      const newErrors: string[] = [];

      if (data.fish_weight <= 0 || data.fish_length <= 0) {
        newErrors.push("Berat dan panjang ikan harus lebih dari 0, harap pastikan data benar.");
      }
      if (data.fish_weight > 10 && data.fish_length > 100) {
        newErrors.push("Berat dan panjang ikan terlalu besar, harap pastikan data benar.");
      } else {
        if (data.fish_weight > 10) {
          newErrors.push("Berat ikan lebih dari 10 kg, harap pastikan data benar.");
        }
        if (data.fish_length > 100) {
          newErrors.push("Panjang ikan lebih dari 100 cm, harap pastikan data benar.");
        }
      }

      if (newErrors.length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();
      formData.append("fish_weight", data.fish_weight.toString());
      formData.append("fish_length", data.fish_length.toString());

      const res = await addFishSampling(pondId, cycleId, formData);

      if (!res.success) {
        setErrors([`Gagal menyimpan sample ikan: ${res.message ?? ""}`]);
        return;
      }

      reset();
      setIsModalOpen(false);
      window.location.reload();

    } catch (error) {
      setErrors(["Gagal menyimpan sample ikan"]);
    }
  };

  return (
    <div>
      {errors.length > 0 && (
        <FishSamplingWarningPopup
          onClose={() => setErrors([])}
          onShowDetail={() => setShowDetail(!showDetail)}
          showDetail={showDetail}
          errorMessages={errors}
        />
      )}

      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label className="text-sm" htmlFor="fish_weight">Berat Ikan (kg)</Label>
          <Input
            {...register('fish_weight', { setValueAs: value => parseFloat(value) })}
            type="number"
            placeholder="Berat Ikan (kg)"
            step={0.01}
            className={`border border-gray-300 p-2 rounded ${
              fishWeight !== null && fishWeight >= 10 ? "text-red-500 border-red-500" : ""
            }`}
            onChange={(e) => handleInputChange("fish_weight", e.target.value)}
          />
        </div>

        <div>
          <Label className="text-sm" htmlFor="fish_length">Panjang Ikan (cm)</Label>
          <Input
            {...register('fish_length', { setValueAs: value => parseFloat(value) })}
            type="number"
            placeholder="Panjang Ikan (cm)"
            step={0.01}
            className={`border border-gray-300 p-2 rounded ${
              fishLength !== null && fishLength >= 100 ? "text-red-500 border-red-500" : ""
            }`}
            onChange={(e) => handleInputChange("fish_length", e.target.value)}
          />
        </div>

        <Button
          className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 col-span-2"
          type="submit"
          disabled={isSubmitting}
        >
          Simpan
        </Button>
      </form>
    </div>
  );
};

export default FishSamplingForm;
