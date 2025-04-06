'use client';

import { FishSampling } from '@/types/fish-sampling';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Dumbbell, Ruler } from 'lucide-react';
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface FishSamplingProps extends React.HTMLAttributes<HTMLDivElement> {
  fishSampling: FishSampling | undefined;
  pondId: string;
  cycleId: string;
}

const FishSamplingList: React.FC<FishSamplingProps> = ({ fishSampling, pondId, cycleId, ...props }) => {
  return (
    <div {...props}>
      {fishSampling ? (
        <div>
          <div className="text-gray-500">
            <div className="flex">
              <p className="font-semibold" data-testid="fish-sample-date">
                Laporan terakhir
              </p>
              <Badge className="ml-2 bg-[#2154C5]">
                {fishSampling.reporter.first_name} {fishSampling.reporter.last_name}
              </Badge>
            </div>
            <p>
              {format(fishSampling.recorded_at, 'EEEE, dd MMMM yyyy', { locale: id })}
            </p>
          </div>
          <div className="grid grid-cols-2 mt-4">
            <div className="flex flex-col">
              <div className="flex gap-2">
                <Dumbbell size={18} /> Berat (kg)
              </div>
              <p className="text-xl font-semibold text-neutral-600" data-testid="fish-weight">
                {fishSampling.fish_weight}
              </p>
            </div>
            <div className="flex flex-col">
              <div className="flex gap-2">
                <Ruler size={18} /> Panjang (cm)
              </div>
              <p className="text-xl font-semibold text-neutral-600" data-testid="fish-length">
                {fishSampling.fish_length}
              </p>
            </div>
          </div>
        </div>
      ) : (
        <p className="text-lg text-neutral-600">Tidak ada sampling ikan</p>
      )}
    </div>
  );
};

export default FishSamplingList;
