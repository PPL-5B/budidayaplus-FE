'use client';

import React, { useEffect, useState } from 'react';
import { fetchFishDeathHistory } from '@/lib/fish-death';
import { DataTable } from '@/components/ui/data-table';
import { columns } from '@/components/fish-death';
import { Skull } from 'lucide-react';
import { FishDeath } from '@/types/fish-death';

interface FishDeathHistoryProps {
  pondId: string;
}

const FishDeathHistory: React.FC<FishDeathHistoryProps> = ({ pondId }) => {
  const [history, setHistory] = useState<FishDeath[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await fetchFishDeathHistory(pondId);
      const sorted = result.fish_deaths.toSorted((a, b) =>
        new Date(b.recorded_at).getTime() - new Date(a.recorded_at).getTime()
      );
      setHistory(sorted);
    };

    fetchData();
  }, [pondId]);

  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div className="w-[80%] flex gap-4">
          <Skull className="w-10 h-10 text-[#2154C5]" />
          <p className="w-full text-start text-3xl font-semibold">Riwayat Kematian Ikan</p>
        </div>
      </div>
      <div className="mt-6">
        <DataTable columns={columns} data={history} />
      </div>
    </div>
  );
};

export default FishDeathHistory;