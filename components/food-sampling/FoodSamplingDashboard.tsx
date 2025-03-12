import React from 'react';
import { Utensils } from 'lucide-react';
import { getLatestFoodSampling } from '@/lib/food-sampling/getLatestFoodSampling';

interface FoodSamplingDashboardProps {
  pondId: string;
  cycleId: string;
}

const FoodSamplingDashboard: React.FC<FoodSamplingDashboardProps> = async ({ pondId, cycleId }) => {
  const latestSampling = await getLatestFoodSampling(pondId, cycleId);

  return (
    <div className="w-full flex flex-col items-center">
      <div className="w-[80%]">
        <div className="flex items-center gap-2 mb-4">
          <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
            <Utensils className="w-10 h-10 text-[#2154C5] mr-2" />
            <span>Dashboard Sampling Pakan Terbaru</span>
          </h2>
        </div>
        {latestSampling ? (
          <div className="flex justify-center">
            <table className="border-collapse border border-gray-300 w-full text-center">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 px-4 py-2">Parameter</th>
                  <th className="border border-gray-300 px-4 py-2">Nilai Aktual</th>
                  <th className="border border-gray-300 px-4 py-2">Nilai Target</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-2 flex items-center justify-center">
                    Kuantitas Makanan
                  </td>
                  <td 
                    className={`border border-gray-300 px-4 py-2 ${latestSampling.food_quantity < latestSampling.target_food_quantity ? 'text-red-500' : ''}`}
                  >
                    {latestSampling.food_quantity} gram
                  </td>
                  <td className="border border-gray-300 px-4 py-2">{latestSampling.target_food_quantity} gram</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 text-gray-500 border border-gray-200">
            Data belum tersedia, silakan isi data terlebih dahulu.
          </div>
        )}
      </div>
    </div>
  );
};

export default FoodSamplingDashboard;
