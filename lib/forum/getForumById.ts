'use server';

import { Forum } from '@/types/forum';
import { cookies } from 'next/headers';

export async function getForumById(forumId: string): Promise<Forum | null> {
  try {
    const token = cookies().get('accessToken')?.value;
    const res = await fetch(`${process.env.API_BASE_URL}/api/forum/get_by_id/${forumId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
} 