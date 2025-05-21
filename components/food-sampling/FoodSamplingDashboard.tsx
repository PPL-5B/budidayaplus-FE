'use client';

import React, { useEffect, useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import { EmptyData } from '@/components/ui/empty-data';
import { LoadingData } from '@/components/ui/loading-data';
import { useRouter } from 'next/navigation';
import { getLatestFoodSampling } from '@/lib/food-sampling/getLatestFoodSampling';
import { FoodSampling } from '@/types/food-sampling';

interface FoodSamplingDashboardProps {
  pondId: string;
  cycleId: string;
}

const FoodSamplingDashboard: React.FC<FoodSamplingDashboardProps> = ({ pondId, cycleId }) => {
  const router = useRouter();
  const [latestSampling, setLatestSampling] = useState<FoodSampling | null>(null);
  const [isLoading, setIsLoading] = useState(true); // tambahkan state loading

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const data = await getLatestFoodSampling(pondId, cycleId);
      setLatestSampling(data ?? null);
      setIsLoading(false);
    };
    fetchData();
  }, [pondId, cycleId]);

  return (
    <div className="w-full flex flex-col items-center bg-[#EDF2FF] pt-6">
      <div className="w-[90%] max-w-2xl">
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#2154C5] mb-4 focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-[#2154C5] font-bold text-base">Kembali</span>
        </button>

        <h2 className="text-lg font-bold text-black mb-4">Dasbor Jumlah Makanan Terbaru</h2>

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
                  <tbody>
                    <tr className="text-gray-800 text-sm font-medium">
                      <td className="py-4 px-4">Kuantitas</td>
                      <td className="py-4 px-4">{latestSampling.target_food_quantity} gram</td>
                      {(() => {
                        const isBelowTarget = latestSampling.food_quantity < latestSampling.target_food_quantity;
                        const cellClass = `py-4 px-4 ${isBelowTarget ? 'text-red-600 font-semibold' : ''}`;
                        return (
                          <td className={cellClass}>
                            {latestSampling.food_quantity} gram
                          </td>
                        );
                      })()}
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

export default FoodSamplingDashboard;
