'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Pencil } from 'lucide-react';
import { PondForm } from '@/components/pond';
import { Dialog, DialogTrigger, DialogContent } from '@/components/ui/dialog';
import { Pond } from '@/types/pond';

interface EditPondProps extends React.HTMLAttributes<HTMLDivElement> {
  pond: Pond;
}

const EditPond: React.FC<EditPondProps> = ({ pond, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div {...props} className="flex justify-center">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex items-center gap-2 rounded-xl bg-green-600 hover:bg-green-700 text-white px-4 py-2 font-semibold text-sm whitespace-nowrap">
            <Pencil size={16} strokeWidth={2} />
            Ubah Data Kolam
          </Button>
        </DialogTrigger>

        <DialogContent className="bg-transparent border-none p-0 max-w-[95vw]">
          <PondForm pond={pond} setIsModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EditPond;
