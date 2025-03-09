'use client'

import React, { useEffect, useState } from 'react';
import { getPondQualityHistory } from '@/lib/pond-quality/getPondQualityHistory';
import { DataTable } from '@/components/ui/data-table';
import { Waves } from 'lucide-react';
import PondQualityDashboard from './PondQualityDashboard';
import { columns } from '@/components/pond-quality';

interface PondQualityHistoryProps {
  pondId: string;
}

const PondQualityHistory: React.FC<PondQualityHistoryProps> = ({ pondId }) => {
  const [history, setHistory] = useState<any[]>([]);
  const [cycleId, setCycleId] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      const result = await getPondQualityHistory(pondId);
      setHistory(result.pond_qualities);
      setCycleId(result.cycle_id);
    };

    fetchHistory();
  }, [pondId]);

  return (
    <div className="w-full">
      <PondQualityDashboard pondId={pondId} cycleId={cycleId} />

      <div className="mt-2"></div>

      <div className="flex justify-center">
        <div className="w-[80%] flex gap-4">
          <Waves className="w-10 h-10 text-[#2154C5]" />
          <p className="w-full text-start text-3xl font-semibold">Riwayat Kualitas Kolam</p>
        </div>
      </div>
      
      <div className="mt-6">
        <DataTable columns={columns} data={history} />
      </div>
    </div>
  );
};

export default PondQualityHistory;
