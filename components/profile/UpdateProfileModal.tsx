'use client'

import React, { useState } from 'react'
import { DialogContent, Dialog, DialogTrigger } from '@/components/ui/dialog'
import { UpdateProfileForm } from '@/components/profile'
import { Profile } from '@/types/profile'

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

         <DialogContent className="w-[350px] max-w-xl p-0 bg-transparent shadow-none [&>button]:hidden">
          <UpdateProfileForm profile={profile} setIsModalOpen={setIsModalOpen} />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default UpdateProfileModal