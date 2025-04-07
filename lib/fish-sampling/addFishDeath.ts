'use server';

import { cookies } from "next/headers";

const API_BASE_URL = process.env.API_BASE_URL?.replace(/\/$/, "");

export async function addFishDeath(pondId: string, cycleId: string, fishDeath: number) {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    console.error("Token tidak ditemukan!");
    return { success: false, message: "Unauthorized: Token tidak ditemukan" };
  }

  const apiUrl = `${API_BASE_URL}/api/fish-death/${pondId}/${cycleId}/`;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ fish_death_count: fishDeath }),
    });

    const responseText = await response.text(); 
    console.log("Response:", responseText);
  
    if (!response.ok) {
      try {
        const errorData = JSON.parse(responseText); 
        throw new Error(errorData?.message || "Gagal mencatat data kematian ikan");
      } catch {
        throw new Error("Server mengembalikan response yang tidak valid");
      }
    }
  
    const data = JSON.parse(responseText);
    return { success: true, data };
  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan tidak diketahui";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}


export async function getLatestFishDeath(pondId: string, cycleId: string) {
  const token = cookies().get('accessToken')?.value;

  if (!token) {
    console.error("Token tidak ditemukan!");
    return { success: false, message: "Unauthorized: Token tidak ditemukan" };
  }

  const apiUrl = `${API_BASE_URL}/api/fish-death/${pondId}/${cycleId}/latest/`;

  try {
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData?.message || "Gagal mengambil data kematian ikan");
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    let errorMessage = "Terjadi kesalahan tidak diketahui";
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, message: errorMessage };
  }
}