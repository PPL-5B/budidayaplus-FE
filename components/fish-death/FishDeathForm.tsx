'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
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
  const [showDetail, setShowDetail] = useState(false);

  const { register, handleSubmit, formState: { isSubmitting }, reset } = useForm<FishDeathInput>();

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
    } catch (error: any) {
      const message = error?.response?.data?.detail || "Terjadi kesalahan saat menyimpan data.";
      setWarningMessage(message);
    }
  };

  return (
    <>
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

      {warningMessage && (
        <FishDeathWarningPopUp
          message={warningMessage}
          onClose={() => setWarningMessage(null)}
          onToggleDetail={() => setShowDetail(prev => !prev)}
          showDetail={showDetail}
        />
      )}
    </>
  );
};

export default AddFishDeathForm;