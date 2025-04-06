'use server'

import { cookies } from 'next/headers'
import { FishDeath, FishDeathHistory } from '@/types/fish-death'


const API_BASE_URL = process.env.API_BASE_URL

export async function fetchLatestFishDeath(pondId: string, cycleId: string): Promise<FishDeath | undefined> {
  const token = cookies().get('accessToken')?.value
  try {
    const response = await fetch(`${API_BASE_URL}/api/fish-death/${pondId}/${cycleId}/latest/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    return response.ok ? await response.json() : undefined
  } catch (error) {
    console.error("❌ Failed to fetch latest fish death:", error)
    return undefined
  }
}

export async function fetchFishDeathHistory(pondId: string): Promise<FishDeathHistory> {
  const token = cookies().get('accessToken')?.value
  try {
    const response = await fetch(`${API_BASE_URL}/api/fish-death/${pondId}/`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })

    const data = await response.json()
    return response.ok ? data : { fish_deaths: [], cycle_id: '' }
  } catch (error) {
    console.error("❌ Failed to fetch fish death history:", error)
    return { fish_deaths: [], cycle_id: '' }
  }
}
