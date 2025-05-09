'use client'

import React from 'react'
import type { Profile } from '@/types/profile'
import { UpdateProfileModal } from '@/components/profile'

interface UserProfileProps {
  profile: Profile
  isUserSelf?: boolean
}

const ProfileComponent: React.FC<UserProfileProps> = ({ profile, isUserSelf }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 bg-[#EAF0FF] rounded-xl p-4 w-full max-w-md mx-auto">
      {/* Card biru */}
      <div className="bg-[#2254C5] rounded-xl p-4 w-full flex flex-col items-start space-y-1">
        <div className="text-[#EAF0FF] text-2xl font-bold leading-tight">
          Halo, {profile.user.first_name}!
        </div>
        <div className="text-[#EAF0FF] text-base leading-tight">
          {profile.user.phone_number}
        </div>

        {isUserSelf && (
          <UpdateProfileModal profile={profile}>
            <p className="underline text-[#EAF0FF] cursor-pointer text-base leading-tight">
              Ubah Profil
            </p>
          </UpdateProfileModal>
        )}
      </div>
    </div>
  )
}

export default ProfileComponent