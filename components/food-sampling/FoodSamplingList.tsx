import React from 'react';
import { FoodSampling } from '@/types/food-sampling';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '@/components/ui/empty-data';

interface FoodSamplingProps extends React.HTMLAttributes<HTMLDivElement> {
  foodSampling: FoodSampling | undefined;
}

const FoodSamplingList: React.FC<FoodSamplingProps> = ({ foodSampling, ...props }) => {
  return (
    <div {...props} data-testid="food-sampling-list">
      {foodSampling ? (
        <div className="bg-[#F1F5FF] text-[#3B3B3B] p-4 rounded-md border border-[#4D4C4C] mt-4 space-y-2 text-sm">
          <p>
            {format(foodSampling.recorded_at, 'EEEE, d MMMM yyyy', { locale: id })},{" "}
            oleh {foodSampling.reporter.first_name}
          </p>
          <p className="font-semibold">
            Kuantitas (gram): <span className="font-normal">{foodSampling.food_quantity}</span>
          </p>
        </div>
      ) : (
        <div className="mt-5">
          <EmptyData />
        </div>
      )}
    </div>
  );
};

export default FoodSamplingList;
