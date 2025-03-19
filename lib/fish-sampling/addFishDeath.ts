'use server';

import { cookies } from "next/headers";

export async function addFishDeath(pondId: string, cycleId: string, fishDeath: number) {
  const API_BASE_URL = process.env.API_BASE_URL;
  const token = cookies().get('accessToken')?.value;
  const apiUrl = `${API_BASE_URL}/api/fish-death/${pondId}/${cycleId}/`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fish_death: fishDeath }),
    });

    const responseData = await response.json();
    return {
      success: response.ok,
      message: responseData?.message || (response.ok ? 'Data kematian ikan berhasil ditambahkan' : 'Gagal mencatat data kematian ikan'),
    };
  } catch (error) {
    return { success: false, message: "Gagal terhubung ke server" };
  }
}
