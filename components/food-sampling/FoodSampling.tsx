import React from 'react';
import { AddFoodSampling, FoodSamplingList, ViewFoodSamplingHistory } from '@/components/food-sampling';
import { getLatestFoodSampling } from '@/lib/food-sampling';

interface FoodSamplingProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
  cycleId?: string;
}

const FoodSampling: React.FC<FoodSamplingProps> = async ({ pondId, cycleId, ...props }) => {
  const foodSampling = cycleId ? await getLatestFoodSampling(pondId, cycleId) : undefined;

  return (
    <div {...props}>
      <div>
        <p className='text-2xl font-medium'>Jumlah Makanan</p>
        {cycleId && (
          <div className='flex gap-1 items-center mt-2'>
            <AddFoodSampling pondId={pondId} cycleId={cycleId} foodSampling={foodSampling} data-testid="add-food-sampling" />
            <ViewFoodSamplingHistory pondId={pondId} data-testid="view-food-sampling-history" />
          </div>
        )}
      </div>
      <FoodSamplingList foodSampling={foodSampling} data-testid="food-sampling-list" />
    </div>
  );
};

export default FoodSampling;
