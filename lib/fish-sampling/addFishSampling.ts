'use server';

import { cookies } from "next/headers";
import { formDataToObject } from "@/lib/utils";

export async function addFishSampling(
  pondId: string, 
  cycleId: string, 
  data: FormData
): Promise<{ success: boolean; message?: string; error?: string }> {
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

    if (!response.ok) {
      return { success: false, error: responseData.error || "Gagal menyimpan sample ikan" };
    }

    return { success: true, message: "Data pengambilan sampel ikan berhasil ditambahkan" };
  } catch (error) {
    return { success: false, error: "Terjadi kesalahan saat menghubungi server" };
  }
}
