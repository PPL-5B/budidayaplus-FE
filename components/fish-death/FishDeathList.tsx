'use client';

import React, { useEffect, useState } from 'react';
import { getLatestFishDeath } from '@/lib/fish-death/addFishDeath';
import { FishDeath } from '@/types/fish-death';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { Skull } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface FishDeathListProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
  cycleId: string;
}

const FishDeathList: React.FC<FishDeathListProps> = ({ pondId, cycleId, ...props }) => {
  const [fishDeath, setFishDeath] = useState<FishDeath | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDeathData = async () => {
    try {
      const data = await getLatestFishDeath(pondId, cycleId);
      if (data && data.fish_death_count !== undefined) {
        setFishDeath(data);
      }
    } catch (error) {
      console.error('❌ Gagal mengambil data kematian ikan:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeathData();
  }, [pondId, cycleId]);

  if (loading) {
    return <p className="text-neutral-500">Memuat data...</p>;
  }

  return (
    <div {...props}>
      {fishDeath ? (
        <div>
          <div className="text-gray-500">
            <div className="flex">
              <p className="font-semibold" data-testid="fish-death-date">
                Laporan Terakhir
              </p>
              <Badge className="ml-2 bg-[#2154C5]">
                {fishDeath.reporter.first_name} {fishDeath.reporter.last_name}
              </Badge>
            </div>
            <p>
              {format(fishDeath.recorded_at, 'EEEE, dd MMMM yyyy', { locale: id })}
            </p>
          </div>
          <div className="mt-4">
            <div className="flex gap-2 items-center">
              <Skull size={18} /> Jumlah Kematian Ikan
            </div>
            <p className="text-xl font-semibold text-neutral-600" data-testid="fish-death-count">
              {fishDeath.fish_death_count}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-lg text-neutral-600">Tidak ada data kematian ikan</p>
      )}
    </div>
  );
};

export default FishDeathList;
