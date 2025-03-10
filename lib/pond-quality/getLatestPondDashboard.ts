'use server';

import { cookies } from "next/headers";

export async function getLatestPondDashboard(pondId: string, cycleId: string) {
  const accessToken = cookies().get("accessToken")?.value;
  const API_BASE_URL = process.env.API_BASE_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/api/pond-quality/${cycleId}/${pondId}/dashboard-table`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    console.log("🔍 DEBUG: API Response for Latest Pond Quality:", data);

    return response.ok ? data : null;
  } catch (error) {
    console.error("❌ API Error fetching latest pond quality:", error);
    return null;
  }
}
