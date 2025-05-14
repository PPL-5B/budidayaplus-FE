import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingDataProps {
  title?: string;
  description?: string;
}

export const LoadingData: React.FC<LoadingDataProps> = ({
  title = 'Memuat Data Anda...',
  description = 'Mohon tunggu sebentar.',
}) => {
  return (
    <div className="w-full p-6 rounded-md border flex flex-col items-center text-center bg-[#F1F5FF]" style={{ borderColor: '#4D4C4C' }}>
      <Loader2 size={36} className="text-neutral-500 mb-3 animate-spin" />
      <p className="font-semibold text-lg text-neutral-700">{title}</p>
      <p className="text-sm text-neutral-500 mt-1">{description}</p>
    </div>
  );
};

export default LoadingData;