'use server'

import { cookies } from "next/headers";
import { formDataToObject } from "@/lib/utils";

export interface FishSamplingResponse {
  success: boolean;
  message?: string;
  warning?: string; // Tambahkan properti warning
}

export async function addFishSampling(
  pondId: string,
  cycleId: string,
  data: FormData
): Promise<FishSamplingResponse> {
  const API_BASE_URL = process.env.API_BASE_URL;
 
  const token = cookies().get('accessToken')?.value;
  const apiUrl = `${API_BASE_URL}/api/fish-sampling/${pondId}/${cycleId}/`;
  const samplingData = formDataToObject(data);

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,

      },
      body: JSON.stringify(samplingData),
    });

    const responseData = await response.json();


    if (response.ok) {
      return {
        success: true,
        message: responseData?.message || 'Data pengambilan sampel ikan berhasil ditambahkan',
      };
    } else {
      return {
        success: false,
        message: responseData?.message || 'Gagal menambahkan data pengambilan sampel ikan'
      };
    }
  } catch (error) {
    return { success: false, message: "Gagal terhubung ke server" };
  }
}