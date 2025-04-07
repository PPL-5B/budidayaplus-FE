'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { addFishDeath } from '@/lib/fish-death/addFishDeath';

interface AddFishDeathFormProps {
  pondId: string;
  cycleId: string;
  setIsModalOpen: (open: boolean) => void;
}

interface FishDeathInput {
  fish_death_count: number;
}

const AddFishDeathForm: React.FC<AddFishDeathFormProps> = ({ pondId, cycleId, setIsModalOpen }) => {
  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<FishDeathInput>();

  const onSubmit = async (data: FishDeathInput) => {
    try {
      const res = await addFishDeath(pondId, cycleId, data.fish_death_count);

      if (!res.success) return;

      reset();
      setIsModalOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Error adding fish death:", error);
    }
  };

  return (
    <form className="grid grid-cols-2 gap-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="col-span-2">
        <Label htmlFor="fish_death_count">Jumlah Ikan Mati</Label>
        <Input
          id="fish_death_count"
          type="number"
          {...register('fish_death_count', { setValueAs: value => parseInt(value) })}
          placeholder="Jumlah Ikan Mati"
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting}
        className="col-span-2 bg-primary-500 hover:bg-primary-600"
      >
        Simpan
      </Button>
    </form>
  );
};

export default AddFishDeathForm;
