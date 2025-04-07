'use server';

import { cookies } from "next/headers";
import { formDataToObject } from "@/lib/utils";

/**
 * Creates a new forum post or reply.
 * If a parentId is provided, the forum post is created as a reply.
 */
export async function addOrUpdateForum(
  data: FormData,
  parentId?: string
): Promise<{ success: boolean; message?: string; forum?: any }> {
  // Retrieve token from cookies
  const token = cookies().get('accessToken')?.value;
  if (!token) {
    return { success: false, message: 'Unauthorized: No token provided' };
  }

  // Retrieve API base URL from environment
  const baseUrl = process.env.API_BASE_URL;
  if (!baseUrl) {
    return { success: false, message: 'API_BASE_URL is not defined' };
  }

  // Use the create endpoint
  const apiUrl = `${baseUrl}/api/forum/create`;

  // Convert FormData to a plain object
  const forumData = formDataToObject(data);

  // If a parent forum ID is provided, add it to the payload
  if (parentId) {
    forumData.parent_id = parentId;
  }

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
      const forum = await response.json();
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
