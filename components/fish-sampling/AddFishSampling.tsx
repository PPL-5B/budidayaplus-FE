'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosAdd } from 'react-icons/io';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogClose, DialogFooter, DialogTrigger } from '@/components/ui/dialog';
import { FishSamplingForm } from '@/components/fish-sampling';
import { FishSampling } from '@/types/fish-sampling';

interface AddFishSamplingProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
  fishSampling?: FishSampling;
  cycleId: string;
}

const AddFishSampling: React.FC<AddFishSamplingProps> = ({ pondId, fishSampling, cycleId, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleConfirm = () => {
    setIsConfirmOpen(false);

    setIsModalOpen(true);
  };

  return (
    <div {...props}>
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        {fishSampling && (
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'sm'} className="flex" data-testid="add-fish-sampling-button">
              Sample <IoIosAdd size={20} className="ml-1" /> {/* ini tombol form sample */}
            </Button>
          </DialogTrigger>
        )}
        <DialogContent title="Timpa Sampling Ikan">
          <p>Apakah anda yakin untuk menimpa data sampling ikan yang sebelumnya?</p>
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
        {!fishSampling && (
          <DialogTrigger asChild>
            <Button variant={'outline'} size={'sm'} className="flex" data-testid="add-fish-sampling-button">
              Sample <IoIosAdd size={20} className="ml-1" />
            </Button>
          </DialogTrigger>
        )}
        <DialogContent title="Add Fish Sampling">
          <FishSamplingForm setIsModalOpen={setIsModalOpen} pondId={pondId} cycleId={cycleId} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddFishSampling;