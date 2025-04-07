'use server'

import { ForumInput } from '@/types/forum';
import { cookies } from "next/headers";

export async function createForum(data: ForumInput) {
  // Retrieve the token from cookies or your auth context as needed.
    const token = cookies().get('accessToken')?.value;

  const res = await fetch(`${process.env.API_BASE_URL}/api/forum/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    throw new Error('Failed to create forum');
  }

  return res.json();
}
