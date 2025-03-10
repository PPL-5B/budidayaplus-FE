import React from 'react';
import { getFoodSamplingHistory } from '@/lib/food-sampling';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/food-sampling';
import { History } from 'lucide-react';

interface FoodSamplingHistoryProps {
  pondId: string;
}

const FoodSamplingHistory: React.FC<FoodSamplingHistoryProps> = async ({ pondId }) => {
  const result = await getFoodSamplingHistory(pondId);
  const history = result.food_samplings;

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-[80%] flex gap-4">
          <History className="w-10 h-10 text-[#2154C5]" />
          <p className="w-full text-start text-3xl font-semibold">Riwayat Sampling Pakan</p>
        </div>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={history} />
      </div>
    </div>
  );
};

export default FoodSamplingHistory;

