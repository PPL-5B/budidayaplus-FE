'use client';

import React, { useState, useEffect } from 'react';
import { getLatestFishDeath } from '@/lib/fish-death/addFishDeath'; 
import { Button } from '@/components/ui/button';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { IoIosAdd } from 'react-icons/io';
import FishDeathForm from './FishDeathForm';

interface AddFishDeathProps {
  pondId: string;
  cycleId: string;
  onFishDeathUpdate?: (count: number) => void;
}

const AddFishDeath: React.FC<AddFishDeathProps> = ({ pondId, cycleId, onFishDeathUpdate }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [fishDeathCount, setFishDeathCount] = useState<number>(0);

  useEffect(() => {
    const fetchLatestFishDeath = async () => {
      try {
        const latestData = await getLatestFishDeath(pondId, cycleId);
        setFishDeathCount(latestData.fish_death_count);
      } catch (error) {
        console.error('❌ Gagal mengambil data kematian ikan:', error);
      }
    };

    fetchLatestFishDeath();
  }, [pondId, cycleId]);

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setIsModalOpen(true);
  };

  return (
    <div>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {fishDeathCount > 0 && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Sample <IoIosAdd size={20} className="ml-1" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent title="Timpa Data Kematian Ikan">
          <p>Apakah Anda yakin ingin menimpa data kematian ikan sebelumnya?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button className="bg-[#ff8585] hover:bg-[#ff8585] text-white rounded-xl" onClick={handleConfirm}>
                Konfirmasi
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {fishDeathCount === 0 && (
          <DialogTrigger asChild>
            <Button variant="outline" size="sm">
              Sample <IoIosAdd size={20} className="ml-1" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent title="Input Kematian Ikan">
          <FishDeathForm
            pondId={pondId}
            cycleId={cycleId}
            setIsModalOpen={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFishDeath;