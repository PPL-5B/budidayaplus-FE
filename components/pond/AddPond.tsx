'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosAdd } from 'react-icons/io';
import { PondForm } from '@/components/pond';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';

const AddPond: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex justify-center">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-1 bg-[#2154C5] hover:bg-[#1a47a8] text-white px-6 py-3 shadow-md">
            <span className="inline-flex items-center justify-center bg-white rounded-full p-0.25 -ml-1 mr-3">
              <IoIosAdd size={20} className="text-[#2154C5]" />
            </span>
            Tambahkan Kolam
          </Button>
        </DialogTrigger>

        {/* DialogContent dengan background transparent dan tanpa padding */}
        <DialogContent className="bg-transparent border-none p-0 max-w-[95vw]">
          <PondForm setIsModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddPond;