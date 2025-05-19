'use client'

import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import LoadingSpinner from '@/components/LoadingSpinner'
import { RegisterForm, registerSchema } from '@/types/auth/register'

import { MdPhone, MdClose } from 'react-icons/md'
import { FaUserAlt } from 'react-icons/fa'
import { RiLockPasswordFill } from 'react-icons/ri'

interface RegisterFormProps {
  onSubmit: (
    data: RegisterForm,
    reset: () => void,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => Promise<void>
  setIsFormOpen: (open: boolean) => void
}

const ReusableRegisterForm: React.FC<RegisterFormProps> = ({ onSubmit, setIsFormOpen }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const [error, setError] = React.useState<string | null>(null)

  const handleFormSubmit = async (data: RegisterForm) => {
    await onSubmit(data, reset, setError)
  }

  return (
    <div className="bg-[#F1F5FF] p-6 rounded-lg w-full mx-auto">
      {/* Header Title + Close */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2154C5] font-semibold text-base">Daftarkan Pekerja</h2>
        <button onClick={() => setIsFormOpen(false)} aria-label="Tutup">
          <MdClose className="text-[#2154C5] w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4" noValidate>
        <div>
          <Label htmlFor="phone_number" className="text-sm text-[#2154C5] flex items-center gap-2">
            <MdPhone className="w-4 h-4 fill-[#2154C5]" /> Nomor Ponsel
          </Label>
          <Input
            id="phone_number"
            type="text"
            className="mt-1 bg-[#E7E7E7]"
            {...register('phone_number')}
            aria-invalid={!!errors.phone_number}
          />
          {errors.phone_number && (
            <p className="text-red-500 text-sm mt-1">{errors.phone_number.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="first_name" className="text-sm text-[#2154C5] flex items-center gap-2">
            <FaUserAlt className="w-4 h-4 fill-[#2154C5]" /> Nama Depan
          </Label>
          <Input
            id="first_name"
            type="text"
            className="mt-1 bg-[#E7E7E7]"
            {...register('first_name')}
            aria-invalid={!!errors.first_name}
          />
          {errors.first_name && (
            <p className="text-red-500 text-sm mt-1">{errors.first_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="last_name" className="text-sm text-[#2154C5] flex items-center gap-2">
            <FaUserAlt className="w-4 h-4 fill-[#2154C5]" /> Nama Belakang
          </Label>
          <Input
            id="last_name"
            type="text"
            className="mt-1 bg-[#E7E7E7]"
            {...register('last_name')}
            aria-invalid={!!errors.last_name}
          />
          {errors.last_name && (
            <p className="text-red-500 text-sm mt-1">{errors.last_name.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="password" className="text-sm text-[#2154C5] flex items-center gap-2">
            <RiLockPasswordFill className="w-4 h-4 fill-[#2154C5]" /> Password
          </Label>
          <Input
            id="password"
            type="password"
            className="mt-1 bg-[#E7E7E7]"
            {...register('password')}
            aria-invalid={!!errors.password}
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>
          )}
        </div>

        <Button
          type="submit"
          className="w-full bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md py-2"
          disabled={isSubmitting}
        >
          {isSubmitting ? <LoadingSpinner className="h-5 w-5" /> : 'Submit'}
        </Button>

        {error && (
          <p className="text-red-500 font-semibold text-sm text-center mt-2">{error}</p>
        )}
      </form>
    </div>
  )
}

export default ReusableRegisterForm