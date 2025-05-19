'use client';

import React, { useEffect, useState } from 'react';
import { fetchFishDeathHistory } from '@/lib/fish-death';
import { FishDeath } from '@/types/fish-death';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { EmptyData } from '@/components/ui/empty-data';
import { LoadingData } from '@/components/ui/loading-data';

interface FishDeathHistoryProps {
  pondId: string;
}

const FishDeathHistory: React.FC<FishDeathHistoryProps> = ({ pondId }) => {
  const [history, setHistory] = useState<FishDeath[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const result = await fetchFishDeathHistory(pondId);
      const sorted = result.fish_deaths.toSorted((a, b) =>
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
      );
      setHistory(sorted);
      setIsLoading(false);
    };

    fetchData();
  }, [pondId]);

  return (
    <div className="w-full bg-transparent p-6 rounded-md">
      <p className="text-lg font-bold mb-4">Riwayat Kematian Ikan</p>

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
              key={item.id}
              className="bg-[#EDF2FF] border border-gray-400 rounded-lg p-4 mb-3 text-sm text-gray-700"
            >
              <p className="mb-1">{date}, oleh {fullName}</p>
              <p className="mb-1 font-bold">
                Jumlah Ikan Mati: <span className="font-normal">{item.fish_death_count}</span>
              </p>
              <p className="mb-1 font-bold">
                Jumlah Ikan Hidup: <span className="font-normal">{item.fish_alive_count}</span>
              </p>
            </div>
          );
        });
      })()}
    </div>
  );
};

export default FishDeathHistory;