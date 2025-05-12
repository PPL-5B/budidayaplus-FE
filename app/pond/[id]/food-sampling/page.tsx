import { FoodSamplingHistory } from '@/components/food-sampling';
import FoodSamplingDashboard from '@/components/food-sampling/FoodSamplingDashboard';
import { getLatestCycle } from '@/lib/cycle/getLatestCycle';
import React from 'react';

const FoodSamplingHistoryPage = async ({ params }: { params: { id: string } }) => {
  const cycle = await getLatestCycle()
  return (
    <div className='w-full pb-10 pt-6 bg-[#EDF2FF]'>
      <FoodSamplingDashboard pondId={params.id} cycleId={cycle?.id ?? ""} />
      
      <div className="mt-10 bg-[#EDF2FF]">
        <FoodSamplingHistory pondId={params.id} />
      </div>
    </div>
  );
};

export default FoodSamplingHistoryPage;