'use client';

import React, { useState } from 'react';
import { addFishDeath } from '@/lib/fish-sampling/addFishDeath'; 
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { IoIosAdd } from 'react-icons/io';

interface AddFishDeathProps {
  pondId: string;
  cycleId: string;
}

const AddFishDeath: React.FC<AddFishDeathProps> = ({ pondId, cycleId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [fishDeath, setFishDeath] = useState<number | ''>('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null); 

  const handleSubmit = async () => {
    if (!fishDeath || fishDeath <= 0) {
      setErrorMessage('Jumlah kematian ikan harus lebih dari 0.');
      return;
    }

    setLoading(true);
    setErrorMessage(null); 
    const result = await addFishDeath(pondId, cycleId, fishDeath);
    setLoading(false);

    if (result.success) {
      setIsModalOpen(false);
      setFishDeath('');
    } else {
      setErrorMessage(result.message);
    }
  };

  return (
    <div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Data Kematian Ikan <IoIosAdd size={20} className="ml-1" />
          </Button>
        </DialogTrigger>
        <DialogContent title="Input Kematian Ikan">
          <div className="space-y-4">
            <Input
              type="number"
              value={fishDeath}
              onChange={(e) => {
                const value = e.target.value;
                setFishDeath(value === '' ? '' : Number(value));
                setErrorMessage(null); 
              }}
              min={1}
              placeholder="Masukkan jumlah ikan mati"
              data-testid="fish-death-input"
            />
            {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>} 
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-500 hover:bg-blue-600 text-white" data-testid="submit-button">
              {loading ? 'Menyimpan...' : 'Simpan'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFishDeath;
