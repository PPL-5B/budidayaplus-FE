'use client';

import React, { useState, useEffect } from 'react';
import { getLatestFishDeath } from '@/lib/fish-death/addFishDeath';
import { Button } from '@/components/ui/button';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogFooter, DialogClose } from '@/components/ui/dialog';
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
  const [fishDeathCount, setFishDeathCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchLatestFishDeath = async () => {
      try {
        const latestData = await getLatestFishDeath(pondId, cycleId);
        setFishDeathCount(latestData?.fish_death_count ?? 0);
      } catch (error) {
        console.error('❌ Gagal mengambil data kematian ikan:', error);
        setFishDeathCount(0); // fallback supaya tetap bisa submit
      }
    };

    fetchLatestFishDeath();
  }, [pondId, cycleId]);

  const handleClick = () => {
    if (fishDeathCount && fishDeathCount > 0) {
      setIsConfirmOpen(true);
    } else {
      setIsModalOpen(true);
    }
  };

  const handleConfirm = () => {
    setIsConfirmOpen(false);
    setIsModalOpen(true);
  };

  return (
    <>
      {/* Tombol Sample selalu muncul */}
      <Button variant="outline" size="sm" onClick={handleClick}>
        Sample <IoIosAdd size={20} className="ml-1" />
      </Button>

      {/* Dialog Konfirmasi jika mau timpa */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent title="Timpa Data Kematian Ikan">
          <p>Apakah Anda yakin ingin menimpa data kematian ikan sebelumnya?</p>
          <DialogFooter>
            <DialogClose asChild>
              <Button
                className="bg-[#ff8585] hover:bg-[#ff8585] text-white rounded-xl"
                onClick={handleConfirm}
              >
                Konfirmasi
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Form Input Kematian */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent title="Input Kematian Ikan">
          <FishDeathForm
            pondId={pondId}
            cycleId={cycleId}
            setIsModalOpen={setIsModalOpen}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AddFishDeath;
