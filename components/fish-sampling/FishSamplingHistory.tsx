'use client';

import React, { useEffect, useState } from 'react';
import { fetchFishSamplingHistory } from '@/lib/fish-sampling';
import { FishSampling } from '@/types/fish-sampling';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '@/components/ui/empty-data';
import { LoadingData } from '@/components/ui/loading-data';

interface FishSamplingHistoryProps {
  pondId: string;
}

const FishSamplingHistory: React.FC<FishSamplingHistoryProps> = ({ pondId }) => {
  const [history, setHistory] = useState<FishSampling[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      setIsLoading(true);
      const result = await fetchFishSamplingHistory(pondId);
      setHistory(result.fish_samplings || []);
      setIsLoading(false);
    };
    fetchHistory();
  }, [pondId]);

  return (
    <div className="w-full bg-transparent p-6 rounded-md">
      <p className="text-lg font-bold mb-4">Riwayat Ukuran Ikan</p>

      {(() => {
        if (isLoading) {
          return <LoadingData />;
        }

        if (history.length === 0) {
          return <EmptyData />;
        }

        return history.map((item) => {
          const date = format(new Date(item.recorded_at), 'EEEE, d MMM yyyy', { locale: id });
          const fullName = `${item.reporter.first_name} ${item.reporter.last_name}`;

          return (
            <div
              key={item.sampling_id}
              className="bg-[#EDF2FF] border border-gray-400 rounded-lg p-4 mb-3 text-sm text-gray-700"
            >
              <p className="mb-1">{date}, oleh {fullName}</p>
              <p className="mb-1 font-bold">
                Berat Ikan (kg): <span className="font-normal">{item.fish_weight}</span>
              </p>
              <p className="mb-1 font-bold">
                Panjang Ikan (cm): <span className="font-normal">{item.fish_length}</span>
              </p>
            </div>
          );
        });
      })()}
    </div>
  );
};

export default FishSamplingHistory;
