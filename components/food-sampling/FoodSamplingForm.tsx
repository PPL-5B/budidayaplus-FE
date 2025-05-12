'use client';

import React, { useEffect, useState } from 'react';
import { FoodSamplingInput, FoodSamplingSchema } from '@/types/food-sampling';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { addFoodSampling } from '@/lib/food-sampling';
import FoodSamplingWarningPopup from './FoodSamplingWarningPopUp';
import { X } from 'lucide-react';

interface FormPropsBase {
  setIsModalOpen: (open: boolean) => void;
}

interface FoodSamplingFormProps extends FormPropsBase {
  pondId: string;
  cycleId: string;
}

const FOOD_QUANTITY_THRESHOLD = parseInt(process.env.NEXT_PUBLIC_FOOD_QUANTITY_THRESHOLD ?? '1000', 10);

const FoodSamplingForm: React.FC<FoodSamplingFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
  } = useForm<FoodSamplingInput>({
    resolver: zodResolver(FoodSamplingSchema),
    defaultValues: {
      food_quantity: 0,
    },
  });

  const foodQuantity = watch('food_quantity');

  useEffect(() => {
    if (foodQuantity > FOOD_QUANTITY_THRESHOLD) {
      setShowPopup(true);
    } else {
      setShowPopup(false);
    }
  }, [foodQuantity]);

  const onSubmit = async (data: FoodSamplingInput) => {
    if (data.food_quantity > FOOD_QUANTITY_THRESHOLD) {
      setShowPopup(true);
      return;
    }

    try {
      const res = await addFoodSampling(data, pondId, cycleId);
      if (!res.success) {
        setErrorMessage('Gagal menyimpan sample makanan');
        return;
      }

      reset();
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error('Gagal menyimpan sample makanan:', error);
      setErrorMessage('Terjadi kesalahan saat menyimpan data. Silakan coba lagi.');
    }
  };

  return (
    <div className="bg-[#F1F5FF] p-5 rounded-lg w-full max-w-xs mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2154C5] font-semibold text-base">Tambah Data Jumlah Makanan</h2>
        <button onClick={() => setIsModalOpen(false)} aria-label="Tutup">
          <X className="text-[#2154C5] w-5 h-5" />
        </button>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="food_quantity" className="text-sm text-[#2154C5]">
            Kuantitas Makanan
          </Label>
          <Input
            id="food_quantity"
            aria-label="Kuantitas Makanan"
            {...register('food_quantity', { setValueAs: (value) => parseInt(value) })}
            type="number"
            placeholder="Kuantitas Makanan"
            className={`mt-1 bg-[#E7E7E7] ${foodQuantity > FOOD_QUANTITY_THRESHOLD ? 'text-red-500' : ''}`}
          />
          {errors.food_quantity && (
            <p className="text-sm text-red-500 mt-1">{errors.food_quantity.message}</p>
          )}
        </div>

        {errorMessage && (
          <p className="text-sm text-red-500" data-testid="error-message">
            {errorMessage}
          </p>
        )}

        <Button
          className="w-full bg-[#2154C5] hover:bg-[#1A3F96] text-white font-medium rounded-md py-2"
          type="submit"
          disabled={isSubmitting}
        >
          Submit
        </Button>
      </form>

      {showPopup && (
        <FoodSamplingWarningPopup
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default FoodSamplingForm;