"use server";

import { cookies } from "next/headers";

export async function upvoteForum(forumId: string) {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${process.env.API_BASE_URL}/api/forum/upvote/${forumId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error ?? "Gagal memberikan upvote");
  }
}

export async function downvoteForum(forumId: string) {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${process.env.API_BASE_URL}/api/forum/downvote/${forumId}`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error ?? "Gagal memberikan downvote");
  }
}

export async function cancelVote(forumId: string) {
    const accessToken = cookies().get("accessToken")?.value;
  
    if (!accessToken) throw new Error("Token tidak ditemukan");
  
    const res = await fetch(`${process.env.API_BASE_URL}/api/forum/cancel_vote/${forumId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!res.ok) {
      throw new Error("Gagal membatalkan vote");
    }
  }

export async function fetchVoteSummary(forumId: string) {
    const accessToken = cookies().get("accessToken")?.value;
  
    if (!accessToken) throw new Error("Token tidak ditemukan");
  
    const res = await fetch(`${process.env.API_BASE_URL}/api/forum/vote_summary/${forumId}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error ?? "Gagal mengambil ringkasan vote");
    }
  
    return res.json();
  }

  export async function fetchUserVotes() {
    const accessToken = cookies().get("accessToken")?.value;
  
    if (!accessToken) throw new Error("Token tidak ditemukan");
  
    const res = await fetch(`${process.env.API_BASE_URL}/api/forum/user_votes`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
  
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error?.error ?? "Gagal mengambil data vote user");
    }
  
    return res.json(); // Response akan mencakup daftar vote user
  }