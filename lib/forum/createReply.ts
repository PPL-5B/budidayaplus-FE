'use server'

import { ForumInput } from '@/types/forum';
import { cookies } from "next/headers";
import { getForumById } from '@/lib/forum/getForumById';

export async function createReply({ description, parent_id }: { description: string; parent_id: string }) {
  const token = cookies().get('accessToken')?.value;
  // Fetch parent forum to get title and tag
  const parentForum = await getForumById(parent_id);
  if (!parentForum) throw new Error('Parent forum not found');

  const res = await fetch(`${process.env.API_BASE_URL}/api/forum/create_reply`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      description,
      parent_id,
      title: parentForum.title,
      tag: parentForum.tag,
    }),
  });

  if (!res.ok) {
    throw new Error('Failed to create forum');
  }

  return res.json();
}