'use client'

import React, { useState } from 'react'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { DialogContentNoX } from '@/components/ui/dialog-content-no-x'
import { UpdateProfileForm } from '@/components/profile'
import { Profile } from '@/types/profile'
import IconChevronFilled from '@/components/ui/icon-chevron-filled'

interface UpdateProfileModalProps extends React.HTMLAttributes<HTMLDivElement> {
  profile: Profile
  children: React.ReactNode
}

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({ profile, children, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div {...props}>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          {children}
        </DialogTrigger>

        <DialogContentNoX>
          <div className="relative flex items-center justify-center w-full mb-4">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute left-0 text-[#2254C5]"
            >
              <IconChevronFilled className="h-6 w-6 rotate-[90deg]" fill="#2254C5" />
            </button>

            <h2 className="text-[#2254C5] text-lg font-bold text-center">
              Ubah Profil
            </h2>
          </div>

          <UpdateProfileForm profile={profile} setIsModalOpen={setIsModalOpen} />
        </DialogContentNoX>
      </Dialog>
    </div>
  )
}

export default UpdateProfileModal