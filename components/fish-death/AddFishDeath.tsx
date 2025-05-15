'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosAdd } from 'react-icons/io';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { FishDeathForm } from '@/components/fish-death';
import { FishDeath } from '@/types/fish-death';
import { X } from 'lucide-react';

interface AddFishDeathProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
  fishDeath?: FishDeath;
  cycleId: string;
}

const ConfirmationDialog: React.FC<{
  onConfirm: () => void;
  onCancel: () => void;
}> = ({ onConfirm, onCancel }) => (
  <DialogContent
    title=""
    className="bg-[#F1F5FF] p-5 rounded-lg w-full max-w-xs mx-auto [&>button.absolute]:hidden"
  >
    <div className="flex justify-between items-center mb-3">
      <h2 className="text-[#2154C5] font-semibold text-base">
        Tambahkan Data Kematian Ikan
      </h2>
      <DialogClose asChild>
        <button aria-label="Close">
          <X className="w-5 h-5 text-[#2154C5]" />
        </button>
      </DialogClose>
    </div>
    <p className="text-sm text-[#2154C5] mb-6">
      Apakah anda yakin untuk menambah data Jumlah Kematian Ikan pada hari ini?
    </p>
    <div className="flex justify-center gap-3">
      <DialogClose asChild>
        <Button
          variant="outline"
          className="border-[#2154C5] text-[#2154C5] font-semibold rounded-md px-4"
          onClick={onCancel}
        >
          Tidak
        </Button>
      </DialogClose>
      <DialogClose asChild>
        <Button
          className="bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md px-6"
          onClick={onConfirm}
        >
          Iya
        </Button>
      </DialogClose>
    </div>
  </DialogContent>
);

const AddFishDeath: React.FC<AddFishDeathProps> = ({ pondId, fishDeath, cycleId, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleConfirm = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div {...props}>
      {fishDeath ? (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              data-testid="add-fish-death-button"
              className="flex items-center gap-2 bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md px-4 py-2"
            >
              <IoIosAdd size={16} />
              Tambahkan Data
            </Button>
          </DialogTrigger>
          <ConfirmationDialog onConfirm={handleConfirm} onCancel={handleCancel} />
        </Dialog>
      ) : null}

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {!fishDeath && (
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md px-4 py-2"
              size="sm"
              data-testid="add-fish-death-button"
            >
              <span className="flex items-center justify-center w-5 h-5 text-[#EAF0FF]">
                <IoIosAdd size={14} />
              </span>Tambahkan Data
            </Button>
          </DialogTrigger>
        )}
        <DialogContent
          title=""
          className="p-0 bg-transparent shadow-none border-none [&>button.absolute]:hidden"
        >
          <FishDeathForm
            setIsModalOpen={setIsModalOpen}
            pondId={pondId}
            cycleId={cycleId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFishDeath;