// lib/fetchFishDeathData.ts

interface FishDeathData {
    task: string;
    fishSize: number;
    waterQuality: number;
    feedAmount: number;
    targetFishSize: number;
    targetWaterQuality: number;
    targetFeedAmount: number;
    status: 'Below Target' | 'On Target';
  }
  
  // Fungsi untuk mengambil data (hardcoded untuk saat ini)
  export const fetchFishDeathData = async (): Promise<FishDeathData[]> => {
    // Hardcoded data untuk testing
    const data: FishDeathData[] = [
      {
        task: 'Day 1',
        fishSize: 1.2,
        waterQuality: 7.0,
        feedAmount: 100,
        targetFishSize: 1.5,
        targetWaterQuality: 7.5,
        targetFeedAmount: 120,
        status: 'Below Target',
      },
      {
        task: 'Day 2',
        fishSize: 1.8,
        waterQuality: 7.3,
        feedAmount: 130,
        targetFishSize: 2.0,
        targetWaterQuality: 7.5,
        targetFeedAmount: 140,
        status: 'On Target',
      },
      {
        task: 'Day 3',
        fishSize: 2.1,
        waterQuality: 7.6,
        feedAmount: 150,
        targetFishSize: 2.5,
        targetWaterQuality: 7.5,
        targetFeedAmount: 150,
        status: 'Below Target',
      },
    ];
  
    // Simulate a delay for the fetch operation (like an actual API request)
    await new Promise((resolve) => setTimeout(resolve, 1000));
  
    return data;
  };
  