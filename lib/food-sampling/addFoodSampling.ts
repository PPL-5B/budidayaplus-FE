'use server'

import { FoodSamplingInput } from "@/types/food-sampling";
import { cookies } from "next/headers";

export async function addFoodSampling(
  data: FoodSamplingInput,
  pondId: string,
  cycleId: string,
): Promise<{ success: boolean; message?: string }> {
  const token = cookies().get('accessToken')?.value;

  const baseUrl = process.env.API_BASE_URL;
  const apiUrl = `${baseUrl}/api/food-sampling/${cycleId}/${pondId}/`;

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      ...data,
      recorded_at: new Date()
    }),
  });

  if (response.ok) {
    return { success: true, message: 'Food sampling data submitted successfully' };
  } else {
    const errorResponse = await response.json();
    return { success: false, message: errorResponse?.detail || 'Failed to submit food sampling data' };
  }
}