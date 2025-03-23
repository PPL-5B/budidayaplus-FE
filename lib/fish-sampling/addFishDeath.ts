'use server';


import { cookies } from "next/headers";
import { FishDeathInput } from "@/types/fish-death";


const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, "");


export async function addFishDeath(
  data: FishDeathInput,
  pondId: string,
  cycleId: string,
): Promise<{ success: boolean; message?: string; data?: FishDeathInput }> {
  const token = cookies().get('accessToken')?.value;


  if (!token) {
    console.error("❌ Token tidak ditemukan!");
    return { success: false, message: "Unauthorized: Token tidak ditemukan" };
  }


  const apiUrl = `${API_BASE_URL}/api/fish-death/${pondId}/${cycleId}/`;


  // Pastikan `data` adalah object yang valid sebelum stringify
  if (typeof data !== "object" || data === null) {
    console.error("🚨 Data yang dikirim bukan object!", data);
    return { success: false, message: "Invalid data format: expected an object" };
  }


  const payload = {
    ...data,
    recorded_at: new Date().toISOString(),  
  };


  console.log("🔍 Payload yang dikirim:", JSON.stringify(payload, null, 2));
  console.log("🔗 API URL:", apiUrl);
  console.log("🔑 Token:", token);


  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });


    if (response.ok) {
      return { success: true, message: 'Fish death data submitted successfully' };
    } else {
      const errorResponse = await response.json();
      console.error("❌ Error Response:", errorResponse);
      return { success: false, message: errorResponse?.detail || 'Failed to submit fish death data' };
    }
  } catch (error: unknown) {
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    console.error("❌ Fetch Error:", errorMessage);
    return { success: false, message: errorMessage };
  }
}



