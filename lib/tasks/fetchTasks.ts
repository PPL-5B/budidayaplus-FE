'use server'

import { Task } from "@/types/tasks"
import { cookies } from "next/headers"

export async function fetchTasks(): Promise<Task[]> {
  const token = cookies().get('accessToken')?.value
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL

  try {
    const response = await fetch(`${API_BASE_URL}/api/tasks/`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      }
    })
    const data = await response.json()
    return response.ok ? data : []
  } catch (error) {
    console.log(error)
    return []
  }
}
