'use client';

import React, { useEffect, useState } from 'react';
import { getPondQualityHistory } from '@/lib/pond-quality/getPondQualityHistory';
import { Waves } from 'lucide-react';
import { PondQuality } from '@/types/pond-quality';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '@/components/ui/empty-data';

interface PondQualityHistoryProps {
  pondId: string;
}

const PondQualityHistory: React.FC<PondQualityHistoryProps> = ({ pondId }) => {
  const [history, setHistory] = useState<PondQuality[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getPondQualityHistory(pondId);
      setHistory(result.pond_qualities);
    };
    fetchHistory();
  }, [pondId]);

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-[80%] flex gap-4">
          <Waves className="w-10 h-10 text-[#2154C5]" />
          <p className="w-full text-start text-3xl font-semibold">Riwayat Kualitas Kolam</p>
        </div>
      </div>

      <div className="mt-6">
        {history.length === 0 ? (
          <div className="mt-6">
            <EmptyData />
          </div>
        ) : (
          history.map((item) => (
            <div
              key={item.id}
              className="bg-[#F1F5FF] text-[#3B3B3B] p-4 rounded-md border border-[#4D4C4C] mt-4 space-y-2 text-sm"
            >
              <p>
                {format(item.recorded_at, 'EEEE, d MMMM yyyy', { locale: id })},{" "}
                oleh {item.reporter.first_name} {item.reporter.last_name}
              </p>
              <p className="font-semibold">Suhu (°C): <span className="font-normal">{item.water_temperature}°C</span></p>
              <p className="font-semibold">pH level: <span className="font-normal">{item.ph_level}</span></p>
              <p className="font-semibold">Salinitas: <span className="font-normal">{item.salinity}</span></p>
              <p className="font-semibold">Kecerahan (cm): <span className="font-normal">{item.water_clarity}</span></p>
              <p className="font-semibold">Sirkulasi: <span className="font-normal">{item.water_circulation}</span></p>
              <p className="font-semibold">DO (mg/L): <span className="font-normal">{item.dissolved_oxygen}</span></p>
              <p className="font-semibold">ORP (mV): <span className="font-normal">{item.orp}</span></p>
              <p className="font-semibold">NH₃ (mg/L): <span className="font-normal">{item.ammonia}</span></p>
              <p className="font-semibold">NO₃ (mg/L): <span className="font-normal">{item.nitrate}</span></p>
              <p className="font-semibold">PO₄ (mg/L): <span className="font-normal">{item.phosphate}</span></p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PondQualityHistory;
