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
  const [showDetail, setShowDetail] = useState(false);
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
    <div>
      <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div className="col-span-2">
          <Label className="text-sm" htmlFor="food_quantity">
            Kuantitas Makanan
          </Label>
          <Input
            id="food_quantity"
            aria-label="Kuantitas Makanan"
            {...register('food_quantity', { setValueAs: (value) => parseInt(value) })}
            type="number"
            placeholder="Kuantitas Makanan"
            className={foodQuantity > FOOD_QUANTITY_THRESHOLD ? 'text-red-500' : ''}
          />
          {errors.food_quantity && <span>{errors.food_quantity.message}</span>}
        </div>

        {errorMessage && (
          <div className="col-span-2 text-red-500 text-sm" data-testid="error-message">
            {errorMessage}
          </div>
        )}

        <Button
          className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 col-span-2"
          type="submit"
          disabled={isSubmitting}
        >
          Simpan
        </Button>
      </form>

      {showPopup && (
        <FoodSamplingWarningPopup
          onClose={() => setShowPopup(false)}
          onShowDetail={() => setShowDetail(true)}
          showDetail={showDetail}
        />
      )}
    </div>
  );
};

export default FoodSamplingForm;