'use server';

import { cookies } from "next/headers";
import { formDataToObject } from "@/lib/utils";
import { Forum } from "@/types/forum"; // pastikan ada

export async function addOrUpdateForum(
  data: FormData,
  parentId?: string
): Promise<{ success: boolean; message?: string; forum?: Forum }> {
  const token = cookies().get('accessToken')?.value;
  if (!token) return { success: false, message: 'Unauthorized: No token provided' };

  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) return { success: false, message: 'API_BASE_URL is not defined' };

  const apiUrl = `${baseUrl}/api/forum/create`;
  const forumData = formDataToObject(data);

  if (parentId) forumData.parent_id = parentId;

  try {
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(forumData),
    });

    if (response.ok) {
      const forum: Forum = await response.json();
      return { success: true, message: 'Forum created successfully', forum };
    } else {
      const errorResponse = await response.json();
      return { success: false, message: errorResponse?.error || 'Failed to create forum post' };
    }
  } catch (error) {
    console.error("Error in addOrUpdateForum:", error);
    return { success: false, message: 'Error creating forum post' };
  }
}
