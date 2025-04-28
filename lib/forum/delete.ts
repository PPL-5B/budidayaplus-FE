// lib/forum/delete.ts
"use server";

import { cookies } from "next/headers";

export async function deleteForumById(forumId: string) {
  const accessToken = cookies().get("accessToken")?.value;

  if (!accessToken) throw new Error("Token tidak ditemukan");

  const res = await fetch(`${process.env.API_BASE_URL}/api/forum/delete/${forumId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error?.error ?? "Gagal menghapus forum");
  }
  
  return res.json();
}
