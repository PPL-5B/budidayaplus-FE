'use client';

import React, { useEffect, useState } from 'react';
import { FoodSamplingInput, FoodSamplingSchema } from '@/types/food-sampling';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { addFoodSampling } from '@/lib/food-sampling';

interface FoodSamplingFormProps {
  setIsModalOpen: (open: boolean) => void;
  pondId: string;
  cycleId: string;
}

const FOOD_QUANTITY_THRESHOLD = 1000;

const FoodSamplingForm: React.FC<FoodSamplingFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
    reset,
    setValue
  } = useForm<FoodSamplingInput>({
    resolver: zodResolver(FoodSamplingSchema),
    defaultValues: {
      food_quantity: 0
    }
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
        console.error("Gagal menyimpan sample makanan");
        return;
      }

      reset();
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Gagal menyimpan sample makanan");
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
            {...register('food_quantity', { setValueAs: value => parseInt(value) })}
            type="number"
            placeholder="Kuantitas Makanan"
            className={foodQuantity > FOOD_QUANTITY_THRESHOLD ? 'text-red-500' : ''}
          />
          {errors.food_quantity && <span>{errors.food_quantity.message}</span>}
        </div>

        <Button
          className="w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 col-span-2"
          type="submit"
          disabled={isSubmitting}
        >
          Simpan
        </Button>
      </form>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-80" data-testid="popup-warning">
            <div className="text-3xl mb-2">⚠️</div>
            <h2 className="text-lg font-bold">Indikator Tidak Sehat!</h2>
            <p className="text-sm text-gray-600">Lihat detail untuk melihat faktor penyebabnya</p>

            {showDetail && (
              <p className="mt-3 text-sm font-medium text-red-500">
                Maksimal kuantitas makanan adalah 1000!
              </p>
            )}

            <div className="grid grid-cols-2 gap-2 mt-4 border-t pt-3">
              <button
                onClick={() => setShowPopup(false)}
                className="text-black font-medium"
              >
                Tutup
              </button>
              <button
                data-testid="detail-button" onClick={() => setShowDetail(true)}
                className="text-red-500 font-medium"
              >
                Lihat Detail
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FoodSamplingForm;