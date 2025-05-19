'use client';

import React, { useEffect, useState } from 'react';
import { getPondQualityHistory } from '@/lib/pond-quality/getPondQualityHistory';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { PondQuality } from '@/types/pond-quality';
import { EmptyData } from '@/components/ui/empty-data';
import { LoadingData } from '@/components/ui/loading-data';

interface PondQualityHistoryProps {
  pondId: string;
}

const PondQualityHistory: React.FC<PondQualityHistoryProps> = ({ pondId }) => {
  const [history, setHistory] = useState<PondQuality[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const result = await getPondQualityHistory(pondId);
      setHistory(result.pond_qualities);
      setIsLoading(false);
    };
    fetchHistory();
  }, [pondId]);

  return (
    <div className="w-full bg-transparent p-6 rounded-md">
      <p className="text-lg font-bold mb-4">Riwayat Kualitas Kolam</p>

      {(() => {
        if (isLoading) {
          return <LoadingData />;
        }

        if (history.length === 0) {
          return <EmptyData />;
        }

        return history.map((item) => {
          const date = format(new Date(item.recorded_at), 'EEEE, d MMMM yyyy', { locale: id });
          const fullName = `${item.reporter.first_name} ${item.reporter.last_name}`;

          return (
            <div
              key={item.id}
              className="bg-[#EDF2FF] border border-gray-400 rounded-lg p-4 mb-3 text-sm text-gray-700"
            >
              <p className="mb-1">{date}, oleh {fullName}</p>
              <p className="mb-1 font-bold">Suhu (°C): <span className="font-normal">{item.water_temperature}</span></p>
              <p className="mb-1 font-bold">pH level: <span className="font-normal">{item.ph_level}</span></p>
              <p className="mb-1 font-bold">Salinitas: <span className="font-normal">{item.salinity}</span></p>
              <p className="mb-1 font-bold">Kecerahan (cm): <span className="font-normal">{item.water_clarity}</span></p>
              <p className="mb-1 font-bold">Sirkulasi: <span className="font-normal">{item.water_circulation}</span></p>
              <p className="mb-1 font-bold">DO (mg/L): <span className="font-normal">{item.dissolved_oxygen}</span></p>
              <p className="mb-1 font-bold">ORP (mV): <span className="font-normal">{item.orp}</span></p>
              <p className="mb-1 font-bold">NH₃ (mg/L): <span className="font-normal">{item.ammonia}</span></p>
              <p className="mb-1 font-bold">NO₃ (mg/L): <span className="font-normal">{item.nitrate}</span></p>
              <p className="mb-1 font-bold">PO₄ (mg/L): <span className="font-normal">{item.phosphate}</span></p>
            </div>
          );
        });
      })()}
    </div>
  );
};

export default PondQualityHistory;
