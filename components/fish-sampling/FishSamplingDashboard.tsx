'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useLatestFishSampling } from '@/hooks/useFishSampling';
import { LoadingData } from '@/components/ui/loading-data';
import { EmptyData } from '@/components/ui/empty-data';

interface FishSamplingDashboardProps {
  pondId: string;
}

const targetValues = {
  fish_weight: 0.15, // kg
  fish_length: 17,   // cm
};

const FishSamplingDashboard: React.FC<FishSamplingDashboardProps> = ({ pondId }) => {
  const router = useRouter();
  const data = useLatestFishSampling(pondId);

  const isLoading = data === undefined;
  const latestSampling = data ?? null;

  return (
    <div className="w-full flex flex-col items-center bg-[#EDF2FF] pt-6">
      <div className="w-[90%] max-w-2xl">
        {/* Tombol kembali */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#2154C5] mb-4 focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-[#2154C5] font-bold text-base">Lihat Riwayat Ukuran Ikan</span>
        </button>

        {/* Judul */}
        <h2 className="text-lg font-bold text-black mb-4">Dasbor Ukuran Ikan Terbaru</h2>

        {/* Konten utama */}
        {(() => {
          if (isLoading) {
            return <LoadingData />;
          }

          if (latestSampling) {
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
                  <tbody className="text-sm text-gray-800 font-medium">
                    <tr>
                      <td className="py-4 px-4">Berat Ikan (kg)</td>
                      <td className="py-4 px-4">{targetValues.fish_weight}</td>
                      <td className="py-4 px-4">{latestSampling.fish_weight ?? 'N/A'}</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">Panjang Ikan (cm)</td>
                      <td className="py-4 px-4">{targetValues.fish_length}</td>
                      <td className="py-4 px-4">{latestSampling.fish_length ?? 'N/A'}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }

          return (
            <div className="mt-6">
              <EmptyData />
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default FishSamplingDashboard;
