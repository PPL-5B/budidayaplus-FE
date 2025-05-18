import React from 'react';
import { Frown } from 'lucide-react';

interface EmptyStateProps {
  title?: string;
  description?: string;
}

export const EmptyPool: React.FC<EmptyStateProps> = ({
  title = 'Belum Ada Kolam!',
  description = 'Tambahkan kolam agar dapat memulai siklus.',
}) => {
  return (
    <div className="w-full p-6 rounded-md border flex flex-col items-center text-center bg-[#F1F5FF]" style={{ borderColor: '#4D4C4C' }}>
      <Frown size={36} className="text-neutral-500 mb-3" />
      <p className="font-semibold text-lg text-neutral-700">{title}</p>
      <p className="text-sm text-neutral-500 mt-1">{description}</p>
    </div>
  );
};
