'use client';

import React, { useEffect, useState } from 'react';
import { getFoodSamplingHistory } from '@/lib/food-sampling';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '@/components/ui/empty-data';
import { LoadingData } from '@/components/ui/loading-data';
import { FoodSampling } from '@/types/food-sampling';

interface FoodSamplingHistoryProps {
  pondId: string;
}

const FoodSamplingHistory: React.FC<FoodSamplingHistoryProps> = ({ pondId }) => {
  const [history, setHistory] = useState<FoodSampling[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const result = await getFoodSamplingHistory(pondId);
      setHistory(result.food_samplings || []);
      setIsLoading(false);
    };
    fetchHistory();
  }, [pondId]);

  return (
    <div className="w-full bg-[#e8f0fe] p-6 rounded-md">
      <p className="text-lg font-bold mb-4">Riwayat Jumlah Makanan</p>

      {(() => {
        if (isLoading) {
          return <LoadingData />;
        }

        if (history.length === 0) {
          return <EmptyData />;
        }

        return history.map((item, index) => {
          const date = format(new Date(item.recorded_at), 'EEEE, d MMM yyyy', { locale: id });
          const fullName = `${item.reporter.first_name} ${item.reporter.last_name}`;

          return (
            <div
              key={item.sampling_id}
              className="bg-[#EDF2FF] border border-gray-400 rounded-lg p-4 mb-3 text-sm text-gray-700"
            >
              <p className="mb-1">
                {date}, oleh {fullName}
              </p>
              <p className="font-bold">
                Kuantitas (gram): <span className="font-normal">{item.food_quantity}</span>
              </p>
            </div>
          );
        });
      })()}
    </div>
  );
};

export default FoodSamplingHistory;
