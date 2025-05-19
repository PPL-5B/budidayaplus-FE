import { useEffect, useState } from 'react';
import { fetchLatestFishDeath } from '@/lib/fish-death';
import { FishDeath } from '@/types/fish-death';
import { useCycle } from '@/hooks/useCycle'; 

export function useLatestFishDeath(pondId: string) {
  const [data, setData] = useState<FishDeath | null | undefined>(undefined);
  const cycle = useCycle();

  useEffect(() => {
    const fetchData = async () => {
      if (!pondId || !cycle) return;

      try {
        const res = await fetchLatestFishDeath(pondId, cycle.id);
        setData(res ?? null);
      } catch {
        setData(null);
      }
    };

    fetchData();
  }, [pondId, cycle]);

  return data;
}
