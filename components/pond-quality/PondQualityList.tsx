'use client';

import React, { useEffect, useState } from 'react';
import { getLatestPondQuality } from '@/lib/pond-quality';
import { PondQuality } from '@/types/pond-quality';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Badge } from '@/components/ui/badge';
import { EmptyData } from '../ui/empty-data';

interface PondQualityListProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
  cycleId: string;
}

const PondQualityList: React.FC<PondQualityListProps> = ({ pondId, cycleId, ...props }) => {
  const [pondQuality, setPondQuality] = useState<PondQuality | null>(null);

  useEffect(() => {
    const fetchPondQuality = async () => {
      try {
        const latest = await getLatestPondQuality(pondId, cycleId);
        if (latest) setPondQuality(latest);
      } catch (error) {
        console.error('❌ Gagal mengambil data kualitas kolam:', error);
      } 
    };

    fetchPondQuality();
  }, [pondId, cycleId]);

  return (
    <div {...props} data-testid="pond-quality-list">
      {pondQuality ? (
        <div className="bg-[#F1F5FF] text-[#3B3B3B] p-4 rounded-md border border-[#4D4C4C] mt-4 space-y-2 text-sm">
          <div className="text-gray-500">
            <div className="flex">
              <p className="font-semibold">Laporan Terakhir</p>
              <Badge className="ml-2 bg-[#2154C5]">
                {pondQuality.reporter.first_name} {pondQuality.reporter.last_name}
              </Badge>
            </div>
            <p>{format(pondQuality.recorded_at, 'EEEE, dd MMMM yyyy', { locale: id })}</p>
          </div>
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
            Kejernihan Air (NTU): <span className="font-normal">{pondQuality.water_clarity}</span>
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
        <div className="mt-4">
          <EmptyData />
        </div>
      )}
    </div>
  );
};

export default PondQualityList;
