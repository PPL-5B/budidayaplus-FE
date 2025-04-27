'use client'

import { Profile, UpdateProfileInput, UpdateProfileSchema } from '@/types/profile'
import { zodResolver } from '@hookform/resolvers/zod'
import React from 'react'
import { useForm } from 'react-hook-form'
import { NewButton } from '@/components/ui/new-button'
import { NewInput } from '@/components/ui/new-input'
import { Label } from '@/components/ui/label'
import { updateProfile } from '@/lib/profile'
import { useToast } from '@/hooks/use-toast'
import { User } from 'lucide-react'

interface UpdateProfileFormProps extends React.HTMLAttributes<HTMLDivElement> {
  setIsModalOpen: (open: boolean) => void
  profile?: Profile
}

const UpdateProfileForm: React.FC<UpdateProfileFormProps> = ({ profile, setIsModalOpen, ...props }) => {
  const { toast } = useToast()

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
      toast({
        title: 'Berhasil mengupdate profil',
        description: 'Berhasil mengubah nama depan dan/atau nama belakang',
        variant: 'success',
      })
    } else {
      toast({
        title: 'Gagal mengupdate profil',
        description: 'Silakan periksa kembali data Anda',
        variant: 'destructive',
      })
    }
    setIsModalOpen(false)
    reset()
  }

  return (
    <div {...props} className="flex flex-col gap-6"> {/* HAPUS w-full */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 w-full">
{/* Field Nama Depan */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="firstName" className="flex items-center gap-2 text-[#2254C5]">
            <User className="h-4 w-4" /> Nama Depan
          </Label>
          <NewInput
            id="firstName"
            placeholder="Nama Depan"
            {...register('first_name')}
          />
          {errors.first_name && <p className="text-red-500 text-sm">{errors.first_name.message}</p>}
        </div>

        {/* Field Nama Belakang */}
        <div className="flex flex-col gap-1">
          <Label htmlFor="lastName" className="flex items-center gap-2 text-[#2254C5]">
            <User className="h-4 w-4" /> Nama Belakang
          </Label>
          <NewInput
            id="lastName"
            placeholder="Nama Belakang"
            {...register('last_name')}
          />
          {errors.last_name && <p className="text-red-500 text-sm">{errors.last_name.message}</p>}
        </div>

        {/* Button Submit */}
        <NewButton type="submit" disabled={isSubmitting} className="mt-2">
          Submit
        </NewButton>
      </form>
    </div>
  )
}

export default UpdateProfileForm
