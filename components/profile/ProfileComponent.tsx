'use client'

import React from 'react'
import type { Profile } from '@/types/profile'
import { UpdateProfileModal } from '@/components/profile'
import { logout } from '@/lib/auth/logout/logoutAction'
import { LogOut } from 'lucide-react'

interface UserProfileProps {
  profile: Profile
  isUserSelf?: boolean
}

const ProfileComponent: React.FC<UserProfileProps> = ({ profile, isUserSelf }) => {
  return (
    <div
      className="flex flex-col items-center justify-center py-4 bg-[#EAF0FF] rounded-xl p-4 w-full max-w-md mx-auto"
      data-testid="profile-component"
    >
      <div
        className="bg-[#2254C5] rounded-xl p-4 w-full flex flex-col space-y-2 min-h-[130px] justify-center"
        data-testid="profile-card"
      >
        {/* Baris Atas: Halo + Logout */}
        <div
          className="flex items-center justify-between w-full"
          data-testid="profile-header"
        >
          <div
            className="text-[#EAF0FF] text-2xl font-bold"
            data-testid="profile-greeting"
          >
            Halo, {profile.user.first_name}!
          </div>
          {isUserSelf && (
            <button
              onClick={() => logout()}
              className="flex items-center gap-1 text-white hover:text-red-300"
              aria-label="Logout"
              data-testid="logout-button"
            >
              <LogOut className="w-5 h-5" data-testid="logout-icon" />
              <span className="text-sm font-medium" data-testid="logout-text">Keluar</span>
            </button>
          )}
        </div>

        {/* No HP */}
        <div className="text-[#EAF0FF] text-base" data-testid="phone-number">
          {profile.user.phone_number}
        </div>

        {/* Modal Ubah Profil */}
        {isUserSelf && (
          <UpdateProfileModal profile={profile}>
            <p
              className="underline text-[#EAF0FF] cursor-pointer text-base"
              data-testid="edit-profile-link"
            >
              Ubah Profil
            </p>
          </UpdateProfileModal>
        )}
      </div>
    </div>
  )
}

export default ProfileComponent
