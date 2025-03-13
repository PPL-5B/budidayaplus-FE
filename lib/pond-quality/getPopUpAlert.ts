// lib/pond-quality/getPopUpAlert.ts

import { cookies } from "next/headers";

export interface Alert {
    parameter: string;
    actual_value: number;
    target_value: number;
    status: string;
  }
  
  export async function getPopUpAlert(pondId: string, cycleId: string): Promise<Alert[]> {
    const accessToken = cookies().get("accessToken")?.value;
    const API_BASE_URL = process.env.API_BASE_URL;
  
    try {
      const response = await fetch(`${API_BASE_URL}/api/pond-quality/${pondId}/alerts`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken}`,
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
  