'use server'

import { FishSampling, FishSamplingHistory } from "@/types/fish-sampling";
import { cookies } from "next/headers"

const API_BASE_URL = process.env.API_BASE_URL

export async function fetchLatestFishSampling(pondId: string, cycleId: string): Promise<FishSampling | undefined> {
  const token = cookies().get('accessToken')?.value;
  try {
    const response = await fetch(`${API_BASE_URL}/api/fish-sampling/${pondId}/${cycleId}/latest/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
    return response.ok ? await response.json() : undefined;
  } catch {
    return undefined;
  }
}

export async function fetchFishSamplingHistory(pondId: string): Promise<FishSamplingHistory> {
  const token = cookies().get('accessToken')?.value;
  try {
    const response = await fetch(`${API_BASE_URL}/api/fish-sampling/${pondId}/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      }
    });
    const data = await response.json()
    return response.ok ? data : { fish_samplings: [], cycle_id: '' };
  } catch {
    return { fish_samplings: [], cycle_id: '' }
  }
}