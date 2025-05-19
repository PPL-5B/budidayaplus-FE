'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Modal as DialogContent } from '@/components/ui/modal';
import { PondForm } from '@/components/pond';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Pond } from '@/types/pond';
import { Pencil } from 'lucide-react';

interface EditPondProps extends React.HTMLAttributes<HTMLDivElement> {
  pond: Pond
}

const EditPond: React.FC<EditPondProps> = ({ pond, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  return (
    <div {...props}>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button
          className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-semibold text-sm whitespace-nowrap"
          >
          <Pencil size={16} strokeWidth={2} />
          Ubah Data Kolam
          </button>
        </DialogTrigger>
        <DialogContent title='Edit Kolam'>
          <PondForm pond={pond} setIsModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditPond;