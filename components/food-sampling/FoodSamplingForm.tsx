'use client';

import { FoodSampling, FoodSamplingInput, FoodSamplingSchema } from '@/types/food-sampling';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addFoodSampling } from '@/lib/food-sampling';
import { objectToFormData } from '@/lib/utils'

interface FoodSamplingFormProps {
  setIsModalOpen: (open: boolean) => void
  foodSampling?: FoodSampling
  pondId?: string
  cycleId?: string
}

const FoodSamplingForm: React.FC<FoodSamplingFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset
  } = useForm<FoodSamplingInput>({
    resolver: zodResolver(FoodSamplingSchema),
    defaultValues: {
      food_quantity: 0
    }
  })

  const onSubmit = async (data: FoodSamplingInput) => {
    try {
      setError(null)
      const foodSamplingData = objectToFormData(data)

      const res = await addFoodSampling(foodSamplingData, pondId, cycleId)

      if (!res.success) {
        setError('Gagal menyimpan sample makanan')
        return
      }

      reset()
      setIsModalOpen(false)
      window.location.reload()

    } catch (error) {
      setError('Gagal menyimpan sample makanan')
    }
  }

  return (
    <div>
      <form className='grid grid-cols-2 gap-4' onSubmit={handleSubmit(onSubmit)}>

        <div className='col-span-2'>
          <Input
            {...register('food_quantity', { setValueAs: value => parseInt(value) })}
            type="number"
            placeholder="Kuantitas Makanan"
            step={0.01}
          />
          {errors.food_quantity && <span>{errors.food_quantity.message}</span>}
        </div>

        <Button className='w-full bg-primary-500 hover:bg-primary-600 active:bg-primary-700 col-span-2' type='submit' disabled={isSubmitting}>
          Simpan
        </Button>
        {error && <p className='w-full text-center text-red-500'>{error}</p>}
      </form>
    </div>
  );
};

export default FoodSamplingForm;
