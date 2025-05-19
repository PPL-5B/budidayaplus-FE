'use client'

import { Profile, UpdateProfileInput, UpdateProfileSchema } from '@/types/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { updateProfile } from '@/lib/profile'
import { FaUserAlt } from 'react-icons/fa'
import { MdClose } from 'react-icons/md'

import { Label } from '@/components/ui/label'
import { NewInput } from '@/components/ui/new-input'
import { NewButton } from '@/components/ui/new-button'

interface UpdateProfileFormProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsModalOpen: (open: boolean) => void
  profile?: Profile
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ profile, setIsModalOpen, ...props }) => {
  const [errorMessage] = useState('')
  const [successMessage] = useState('')

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileInput>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: profile && {
      first_name: profile.user.first_name,
      last_name: profile.user.last_name,
    },
  })

  const onSubmit = async (data: UpdateProfileInput) => {
    const result = await updateProfile(data)
    if (result) {
      setIsModalOpen(false)
      reset()
    }
  }

  return (
    <div className="bg-[#F1F5FF] p-6 rounded-lg w-full max-w-md mx-auto" {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Header Title + Close */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-[#2154C5] font-semibold text-base">Ubah Profil</h2>
          <button onClick={() => setIsModalOpen(false)} aria-label="Tutup">
            <MdClose className="text-[#2154C5] w-5 h-5" />
          </button>
        </div>

        <div>
          <Label htmlFor="firstName" className="text-sm text-[#2154C5] flex items-center gap-2">
            <FaUserAlt className="w-4 h-4 fill-[#2154C5]" /> Nama Depan
          </Label>
          <NewInput
            id="firstName"
            placeholder="Nama Depan"
            {...register('first_name')}
            className="mt-1 bg-[#E7E7E7]"
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="lastName" className="text-sm text-[#2154C5] flex items-center gap-2">
            <FaUserAlt className="w-4 h-4 fill-[#2154C5]" /> Nama Belakang
          </Label>
          <NewInput
            id="lastName"
            placeholder="Nama Belakang"
            {...register('last_name')}
            className="mt-1 bg-[#E7E7E7]"
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
          )}
        </div>

        {/* Feedback messages */}
        {errorMessage && <p className="text-red-600 text-sm">{errorMessage}</p>}
        {successMessage && <p className="text-green-600 text-sm">{successMessage}</p>}

        <NewButton
          type="submit"
          disabled={isSubmitting}
          className="w-full bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md py-2 mt-2"
        >
          Submit
        </NewButton>
      </form>
    </div>
  )
}

export default UpdateProfileForm