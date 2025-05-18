'use client';

import React from 'react';
import { FishSampling } from '@/types/fish-sampling';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '@/components/ui/empty-data';

interface FishSamplingProps extends React.HTMLAttributes<HTMLDivElement> {
  fishSampling: FishSampling | undefined;
}

const FishSamplingList: React.FC<FishSamplingProps> = ({ fishSampling, ...props }) => {
  return (
    <div {...props} data-testid="fish-sampling-list">
      {fishSampling ? (
        <div className="bg-[#F1F5FF] text-[#3B3B3B] p-4 rounded-md border border-[#4D4C4C] mt-4 space-y-2 text-sm">
          <p>
            {format(fishSampling.recorded_at, 'EEEE, d MMMM yyyy', { locale: id })},{" "}
            oleh {fishSampling.reporter.first_name}
          </p>
          <p className="font-semibold">
            Berat (kg): <span className="font-normal">{fishSampling.fish_weight}</span>
          </p>
          <p className="font-semibold">
            Panjang (cm): <span className="font-normal">{fishSampling.fish_length}</span>
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <EmptyData />
        </div>
      )}
    </div>
  );
};

export default FishSamplingList;
