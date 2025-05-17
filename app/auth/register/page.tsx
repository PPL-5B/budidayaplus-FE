'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { RegisterForm, registerSchema } from '@/types/auth/register'
import { handleRegisterSubmit } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import LoadingSpinner from '@/components/LoadingSpinner'
import { Phone, User, Key } from 'lucide-react'

const RegisterPage = () => {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      setError(null)
      const response = await handleRegisterSubmit(data)

      if (!response.ok) return setError(response.message)

      reset()
      router.push('/')
    } catch {
      setError('Terjadi kesalahan pada registrasi')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f0ff]">
      <div className="w-[90%] max-w-sm flex flex-col items-center">
        <div className="flex justify-center items-center my-4">
          <Image
            src="/BudidayaPlus.svg"
            alt="BudidayaPlus Logo"
            width={128}
            height={128}
            className="w-32 h-32 object-contain"
          />
        </div>

        <h1 className="text-2xl font-bold text-center">Buat Akun</h1>
        <p className="text-center text-sm mt-1 mb-4">
          Mulai kelola budidaya lele dengan lebih mudah!
        </p>

        <form data-testid="register-form" onSubmit={handleSubmit(onSubmit)} className="w-full space-y-4">

          <div>
            <label className="flex items-center text-[#2254C5] font-medium text-sm mb-1">
              <Phone className="w-4 h-4 mr-2" /> Nomor Ponsel
            </label>
            <input
              type="text"
              {...register('phone_number')}
              className="w-full h-11 px-4 rounded-md bg-[#E6E6E5] focus:outline-none"
            />
            {errors.phone_number && (
              <span className="text-sm text-red-500 mt-1">{errors.phone_number.message}</span>
            )}
          </div>

          <div>
            <label className="flex items-center text-[#2254C5] font-medium text-sm mb-1">
              <User className="w-4 h-4 mr-2" /> Nama Depan
            </label>
            <input
              type="text"
              {...register('first_name')}
              className="w-full h-11 px-4 rounded-md bg-[#E6E6E5] focus:outline-none"
            />
            {errors.first_name && (
              <span className="text-sm text-red-500 mt-1">{errors.first_name.message}</span>
            )}
          </div>

          <div>
            <label className="flex items-center text-[#2254C5] font-medium text-sm mb-1">
              <User className="w-4 h-4 mr-2" /> Nama Belakang
            </label>
            <input
              type="text"
              {...register('last_name')}
              className="w-full h-11 px-4 rounded-md bg-[#E6E6E5] focus:outline-none"
            />
            {errors.last_name && (
              <span className="text-sm text-red-500 mt-1">{errors.last_name.message}</span>
            )}
          </div>

          <div>
            <label className="flex items-center text-[#2254C5] font-medium text-sm mb-1">
              <Key className="w-4 h-4 mr-2" /> Password
            </label>
            <input
              type="password"
              {...register('password')}
              className="w-full h-11 px-4 rounded-md bg-[#E6E6E5] focus:outline-none"
            />
            {errors.password && (
              <span className="text-sm text-red-500 mt-1">{errors.password.message}</span>
            )}
          </div>

          <Button
            data-testid="register-button"
            className="w-full h-11 bg-[#2254C5] hover:bg-[#1e4ab0] text-white rounded-md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner className="h-5 w-5" /> : 'Daftar'}
          </Button>

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        </form>

        <p className="text-sm mt-4">
          Sudah punya akun?{' '}
          <a href="/auth/login" className="font-semibold underline text-black">
            Masuk Akun
          </a>
        </p>
      </div>
    </div>
  ) 
}

export default RegisterPage