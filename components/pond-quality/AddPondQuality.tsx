'use client';

import React, { useState } from 'react';
import { IoIosAdd } from 'react-icons/io';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogClose, DialogTrigger } from '@/components/ui/dialog';
import { PondQualityForm } from '@/components/pond-quality';
import { PondQuality } from '@/types/pond-quality';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface AddPondQualityProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
  cycleId: string;
  pondQuality?: PondQuality;
}

const AddPondQuality: React.FC<AddPondQualityProps> = ({ pondId, cycleId, pondQuality, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div {...props} className="flex items-center gap-2">
      {/* KONFIRMASI TIMPA */}
      {pondQuality && (
        <Dialog>
          <DialogTrigger asChild>
            <Button
              size="sm"
              className="flex items-center gap-2 bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md px-4 py-2"
            >
              <IoIosAdd size={16} />
              Tambahkan Data
            </Button>
          </DialogTrigger>
          <DialogContent
            title=""
            className="bg-[#F1F5FF] p-5 rounded-lg w-full max-w-xs mx-auto [&>button.absolute]:hidden"
          >
            <div className="flex justify-between items-center mb-3">
              <h2 className="text-[#2154C5] font-semibold text-base">
                Timpa Data Jumlah Makanan
              </h2>
              <DialogClose asChild>
                <button aria-label="Close">
                  <X className="w-5 h-5 text-[#2154C5]" />
                </button>
              </DialogClose>
            </div>

            <p className="text-sm text-[#2154C5] mb-6 text-center">
              Apakah Anda yakin untuk menimpa data Jumlah Makanan sebelumnya?
            </p>

            <div className="flex justify-center gap-3">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  className="border-[#2154C5] text-[#2154C5] font-semibold rounded-md px-4"
                >
                  Tidak
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button
                  className="bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md px-6"
                  onClick={() => setIsModalOpen(true)}
                >
                  Iya
                </Button>
              </DialogClose>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* FORM TAMBAHKAN DATA */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        {!pondQuality && (
          <DialogTrigger asChild>
            <Button
              className="flex items-center gap-2 bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md px-4 py-2"
              size="sm"
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
          <PondQualityForm
            setIsModalOpen={setIsModalOpen}
            pondId={pondId}
            cycleId={cycleId}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPondQuality;