'use client';

import { PondQuality } from '@/types/pond-quality';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '../ui/empty-data';
import React from 'react';

interface PondQualityProps extends React.HTMLAttributes<HTMLDivElement> {
  pondQuality: PondQuality | undefined;
}

const PondQualityList: React.FC<PondQualityProps> = ({ pondQuality, ...props }) => {
  return (
    <div {...props} data-testid="pond-quality-list">
      {pondQuality ? (
        <div className="bg-[#F1F5FF] text-[#3B3B3B] p-4 rounded-md border border-[#4D4C4C] mt-4 space-y-2 text-sm">
          <p>
            {format(pondQuality.recorded_at, 'EEEE, d MMMM yyyy', { locale: id })},{" "}
            oleh {pondQuality.reporter.first_name} {pondQuality.reporter.last_name}
          </p>
          <p className="font-semibold">
            Suhu (°C): <span className="font-normal">{pondQuality.water_temperature}°C</span>
          </p>
          <p className="font-semibold">
            pH level: <span className="font-normal">{pondQuality.ph_level}</span>
          </p>
          <p className="font-semibold">
            Salinitas: <span className="font-normal">{pondQuality.salinity}</span>
          </p>
          <p className="font-semibold">
            Kecerahan (cm): <span className="font-normal">{pondQuality.water_clarity}</span>
          </p>
          <p className="font-semibold">
            Sirkulasi: <span className="font-normal">{pondQuality.water_circulation}</span>
          </p>
          <p className="font-semibold">
            DO (mg/L): <span className="font-normal">{pondQuality.dissolved_oxygen}</span>
          </p>
          <p className="font-semibold">
            ORP (mV): <span className="font-normal">{pondQuality.orp}</span>
          </p>
          <p className="font-semibold">
            NH₃ (mg/L): <span className="font-normal">{pondQuality.ammonia}</span>
          </p>
          <p className="font-semibold">
            NO₃ (mg/L): <span className="font-normal">{pondQuality.nitrate}</span>
          </p>
          <p className="font-semibold">
            PO₄ (mg/L): <span className="font-normal">{pondQuality.phosphate}</span>
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

export default PondQualityList;