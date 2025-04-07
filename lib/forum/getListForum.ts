'use server'

import { Forum } from "@/types/forum";
import { cookies } from "next/headers";

export async function getListForum(): Promise<Forum[]> {
  try {
    const token = cookies().get('accessToken')?.value;
    const res = await fetch(`${process.env.API_BASE_URL}/api/forum/list`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await res.json();
    if (!res.ok) {
      return [];
    }
    return data;
  } catch {
    return [];
  }
}