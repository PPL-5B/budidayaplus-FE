import React from 'react';
import { AddPondQuality, PondQualityList, ViewPondQualityHistory } from '@/components/pond-quality';
import { getLatestPondQuality } from '@/lib/pond-quality';

interface PondQualityProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
  cycleId : string;
}

const PondQuality: React.FC<PondQualityProps> = async ({ pondId, cycleId, ...props }) => {
  const pondQuality = cycleId ? await getLatestPondQuality(pondId, cycleId) : undefined;

  return (
    <div {...props}>
      <div>
        <h1 className="text-[#2154C5] text-[22px] font-bold">Kualitas Air</h1>
        {cycleId && (
          <div className='flex gap-1 items-center mt-2'>
            <AddPondQuality pondQuality={pondQuality} pondId={pondId} cycleId={cycleId} />
            <ViewPondQualityHistory pondId={pondId} />
          </div>
        )}
      </div>
      <PondQualityList pondId={pondId} cycleId={cycleId} />
    </div>
  );
};

export default PondQuality;
