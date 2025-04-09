// lib/pond-quality/getPopUpAlert.ts


export interface Alert {
  id: string;
  parameter: string;
  actual_value: number;
  target_value: number;
  status: string;
}

export async function getPopUpAlert(pondId: string): Promise<Alert[]> {
  const accessToken = document.cookie.split('; ').find(row => row.startsWith('accessToken='));
  const token = accessToken ? accessToken.split('=')[1] : null;  // Ambil token jika ada
  const API_BASE_URL = process.env.API_BASE_URL;

  if (!token) {
    console.error("No access token found in cookies.");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/api/pond-quality/${pondId}/alerts`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,  // Gunakan token untuk otentikasi
      },
    });

    const data = await response.json();
    console.log("🔍 DEBUG: API Response for Alerts:", data);

    return response.ok ? data : [];
  } catch (error) {
    console.error("❌ API Error fetching alerts:", error);
    return [];
  }
}