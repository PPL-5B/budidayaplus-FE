'use server'

import { PondQualityHistory } from "@/types/pond-quality";
import { cookies } from "next/headers";

export async function getPondQualityHistory(pondId: string): Promise<PondQualityHistory> {
  const accessToken = cookies().get("accessToken")?.value;
  const API_BASE_URL = process.env.API_BASE_URL;

  try {
    const response = await fetch(`${API_BASE_URL}/api/pond-quality/${pondId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
    });

    const data = await response.json();
    return response.ok ? data : { pond_qualities: [], cycle_id: '' };
  } catch {
    return { pond_qualities: [], cycle_id: '' };
  }
}

