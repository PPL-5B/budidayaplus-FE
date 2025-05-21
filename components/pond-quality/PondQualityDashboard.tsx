'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { EmptyData } from '@/components/ui/empty-data';
import { LoadingData } from '@/components/ui/loading-data';
import { useRouter } from 'next/navigation';
import { getPondQualityHistory } from '@/lib/pond-quality/getPondQualityHistory';
import { PondQuality } from '@/types/pond-quality';

interface PondQualityDashboardProps {
  pondId: string;
}

const PondQualityDashboard: React.FC<PondQualityDashboardProps> = ({ pondId }) => {
  const router = useRouter();
  const [latestQuality, setLatestQuality] = useState<PondQuality | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const targetValues = {
    salinity: 5,
    temperature: 27,
    ph: 6
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await getPondQualityHistory(pondId);
      const latest = result.pond_qualities[result.pond_qualities.length - 1];
      setLatestQuality(latest ?? null);
      setIsLoading(false);
    };
    fetchData();
  }, [pondId]);

  return (
    <div className="w-full flex flex-col items-center bg-[#EDF2FF] pt-6">
      <div className="w-[90%] max-w-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#2154C5] mb-4 focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-[#2154C5] font-bold text-base">Lihat Riwayat Kualitas Kolam</span>
        </button>

        <h2 className="text-lg font-bold text-black mb-4">Dasbor Sampling Ikan Terbaru</h2>

        {(() => {
          if (isLoading) return <LoadingData />;
          if (!latestQuality) return <EmptyData />;

          const isSalinityLow = latestQuality.salinity < targetValues.salinity;
          const isTempLow = latestQuality.water_temperature < targetValues.temperature;
          const isPhLow = latestQuality.ph_level < targetValues.ph;

          return (
            <div className="overflow-hidden rounded-xl border border-[#2154C5] bg-[#EDF2FF]">
              <table className="w-full text-center">
                <thead className="bg-[#2154C5] text-white text-sm">
                  <tr>
                    <th className="py-3 px-4 font-semibold">Parameter</th>
                    <th className="py-3 px-4 font-semibold">Nilai Target</th>
                    <th className="py-3 px-4 font-semibold">Nilai Aktual</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-gray-800 text-sm font-medium">
                    <td className="py-4 px-4">Salinitas</td>
                    <td className="py-4 px-4">{targetValues.salinity}</td>
                    <td className={`py-4 px-4 ${isSalinityLow ? 'text-red-600 font-semibold' : ''}`}>
                      {latestQuality.salinity}
                    </td>
                  </tr>
                  <tr className="text-gray-800 text-sm font-medium">
                    <td className="py-4 px-4">Temperatur</td>
                    <td className="py-4 px-4">{targetValues.temperature}</td>
                    <td className={`py-4 px-4 ${isTempLow ? 'text-red-600 font-semibold' : ''}`}>
                      {latestQuality.water_temperature}
                    </td>
                  </tr>
                  <tr className="text-gray-800 text-sm font-medium">
                    <td className="py-4 px-4">pH</td>
                    <td className="py-4 px-4">{targetValues.ph}</td>
                    <td className={`py-4 px-4 ${isPhLow ? 'text-red-600 font-semibold' : ''}`}>
                      {latestQuality.ph_level}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default PondQualityDashboard;
