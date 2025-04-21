"use server";

import { LoginForm } from "@/types/auth/login";
import { cookies } from "next/headers";

export async function handleLoginFormSubmit(data: LoginForm): Promise<{ ok: boolean; message: string }> {
  const reqUrl = `${process.env.API_BASE_URL}/api/auth/login`;
  try {
    const res = await loginRequest(reqUrl, data);

    if (res.ok) {
      await setRefreshAndAccessTokens(res);
      return { ok: true, message: "Login berhasil" };
    }

    const errorResponse = await res.json();
    return { ok: false, message: errorResponse.detail };
  } catch (error) {
    return { ok: false, message: "Terjadi kesalahan saat login" };
  }
}

async function loginRequest(url: string, data: LoginForm): Promise<Response> {
  return fetch(url, {
    method: "POST",
    headers: {"Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
}

async function setRefreshAndAccessTokens(response: Response) {
  const { refresh, access } = await response.json();
  cookies().set("refreshToken", refresh, { path: "/", httpOnly: false, sameSite: "none", secure: true });
  cookies().set("accessToken", access, { path: "/", httpOnly: false, sameSite: "none", secure: true });
}
