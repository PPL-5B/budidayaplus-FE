'use client';

import React from 'react';
import { FishDeath } from '@/types/fish-death';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '@/components/ui/empty-data';

interface FishDeathProps extends React.HTMLAttributes<HTMLDivElement> {
  fishDeath: FishDeath | undefined;
}

const FishDeathList: React.FC<FishDeathProps> = ({ fishDeath, ...props }) => {
  return (
    <div {...props} data-testid="fish-death-list">
      {fishDeath ? (
        <div className="bg-[#F1F5FF] text-[#3B3B3B] p-4 rounded-md border border-[#4D4C4C] mt-4 space-y-2 text-sm">
          <p>
            {format(fishDeath.recorded_at, 'EEEE, d MMMM yyyy', { locale: id })},{" "}
            oleh {fishDeath.reporter.first_name}
          </p>
          <p className="font-semibold">
            Jumlah kematian ikan: <span className="font-normal">{fishDeath.fish_death_count}</span>
          </p>
          <p className="font-semibold">
            Jumlah ikan hidup: <span className="font-normal">{fishDeath.fish_alive_count}</span>
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

export default FishDeathList;
