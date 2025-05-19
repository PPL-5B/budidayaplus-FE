'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { fetchTeamByUsername } from '@/lib/profile'
import { CreateWorkerAccount } from '@/components/profile'
import { toTitleCase } from '@/lib/utils'
import clsx from 'clsx'
import { Profile } from '@/types/profile'
import { LoadingData } from '@/components/ui/loading-data'
import { EmptyData } from '@/components/ui/empty-data'

interface TeamProps {
  username: string
  isUserSelf: boolean
  userRole: 'worker' | 'supervisor'
}

const Team: React.FC<TeamProps> = ({ username, userRole, isUserSelf }) => {
  const [team, setTeam] = useState<Profile[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    const data = await fetchTeamByUsername(username)
    setTeam(data)
    setIsLoading(false)
  }, [username])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  let content: React.ReactNode
  if (isLoading) {
    content = <LoadingData />
  } else if (team.length === 0) {
    content = <EmptyData />
  } else {
    content = (
      <div className="flex flex-col gap-4">
        {team.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between border-2 border-[#4D4C4C] rounded-lg px-4 py-3 bg-[#EDF2FF] text-sm"
          >
            <div>
              <p className="font-bold text-black">
                {member.user.first_name} {member.user.last_name}
              </p>
              <p className="text-gray-700">{member.user.phone_number}</p>
            </div>
            <div
              className={clsx(
                'px-3 py-1 rounded-md text-xs font-semibold',
                member.role === 'supervisor'
                  ? 'bg-red-100 text-red-700'
                  : 'bg-green-100 text-green-700'
              )}
            >
              {toTitleCase(member.role)}
            </div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-[80%] self-center">
        <div className="flex items-center justify-between">
          <p className="text-base font-bold text-black">Anggota Tim</p>
          {isUserSelf && userRole === 'supervisor' && (
            <CreateWorkerAccount onSuccess={fetchData} />
          )}
        </div>
        <div className="mt-6">{content}</div>
      </div>
    </div>
  )
}

export default Team
