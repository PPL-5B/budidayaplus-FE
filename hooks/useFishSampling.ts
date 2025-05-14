import { useEffect, useState } from 'react';
import { fetchLatestFishSampling } from '@/lib/fish-sampling';
import { FishSampling } from '@/types/fish-sampling';
import { useCycle } from '@/hooks/useCycle'; 

export function useLatestFishSampling(pondId: string) {
  const [data, setData] = useState<FishSampling | null | undefined>(undefined);
  const cycle = useCycle();

  useEffect(() => {
    const fetchData = async () => {
      if (!pondId || !cycle) return;

      try {
        const res = await fetchLatestFishSampling(pondId, cycle.id);
        setData(res ?? null);
      } catch {
        setData(null);
      }
    };

    fetchData();
  }, [pondId, cycle]);

  return data;
}
