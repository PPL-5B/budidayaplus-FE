// lib/forum/vote.ts
'use server';

import { cookies } from 'next/headers';

const BASE_URL = process.env.API_BASE_URL;

export const handleVote = async (
  forumId: string,
  type: 'up' | 'down'
): Promise<void> => {
  const token = cookies().get('accessToken')?.value;
  if (!token) throw new Error('Token tidak ditemukan');

  const endpoint = type === 'up'
    ? `/api/forum/upvote/${forumId}`
    : `/api/forum/downvote/${forumId}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    try {
      const error = await res.json();
      throw new Error(error?.error ?? 'Vote gagal');
    } catch {
      throw new Error('Vote gagal atau respons tidak valid');
    }
  }
};

export const cancelVote = async (forumId: string): Promise<void> => {
  const token = cookies().get('accessToken')?.value;
  if (!token) throw new Error('Token tidak ditemukan');

  const res = await fetch(`${BASE_URL}/api/forum/cancel_vote/${forumId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    try {
      const error = await res.json();
      throw new Error(error?.error ?? 'Gagal membatalkan vote');
    } catch {
      throw new Error('Gagal membatalkan vote atau respons tidak valid');
    }
  }
};

export async function getVoteSummary(forumId: string): Promise<{
    upvotes: number;
    downvotes: number;
    user_vote: 'up' | 'down' | null; 
  }> {
    const accessToken = cookies().get('accessToken')?.value;
    if (!accessToken) throw new Error('Token tidak ditemukan');
  
    const res = await fetch(`${process.env.API_BASE_URL}/api/forum/vote_summary/${forumId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!res.ok) throw new Error('Gagal mengambil data vote');
  
    return res.json();
  }
