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


// Fungsi untuk mengambil data dari API
export const fetchFishDeathData = async (pondId: string, cycleId: string): Promise<FishDeathData[]> => {
  const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
  const token = accessToken ? accessToken.split('=')[1] : null;  // Ambil token dari cookies
  const API_BASE_URL = process.env.API_BASE_URL;

  if (!token) {
    console.error("No access token found in cookies.");
    return [];
  }

  try {
    // Fetch data dari API
    const response = await fetch(`${API_BASE_URL}/api/fish-death/${pondId}/${cycleId}/latest/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,  // Gunakan token untuk otentikasi
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch data from API');
    }

    const data = await response.json();

    // Map API response to FishDeathData format
    const fishDeathData: FishDeathData[] = data.map((record: any) => ({
      task: `Day ${record.recorded_at}`,  // Assuming recorded_at is a date and we'll derive the day
      fishSize: record.fish_alive_count,  // Example mapping, adjust as needed based on actual API response
      waterQuality: record.water_quality || 7.5, // Assuming default value if no data
      feedAmount: record.feed_amount || 100, // Assuming default value
      targetFishSize: record.target_fish_size || 1.5,  // Example target values, adjust as needed
      targetWaterQuality: 7.5,
      targetFeedAmount: 120,
      status: record.status === 'On Target' ? 'On Target' : 'Below Target',
    }));

    return fishDeathData;
  } catch (error) {
    console.error("❌ API Error fetching fish death data:", error);
    return [];
  }
};
