'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import LoadingSpinner from '@/components/LoadingSpinner';
import { loginSchema, LoginForm } from '@/types/auth/login';
import { handleLoginFormSubmit } from '@/lib/auth/login/actions';
import { Phone, Key } from 'lucide-react';
import Link from 'next/link';

const LoginPage = () => {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setError(null);
    const response = await handleLoginFormSubmit(data);
    if (response.ok) {
      reset();
      setIsLoggedIn(true);
      return;
    }
    setError(response.message);
  };

  useEffect(() => {
    if (isLoggedIn) {
      router.refresh();
      router.push('/');
    }
  }, [isLoggedIn, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e8f0ff]">
      <div className="w-[90%] max-w-sm flex flex-col items-center">
        
        <div className="flex justify-center items-center my-4">
        </div>

        <h1 className="text-2xl font-bold text-center">Masuk Akun</h1>
        <p className="text-center text-sm mt-1 mb-4">
          Pantau kolam dan hasil panenmu!
        </p>

        <form
          data-testid="login-form"
          onSubmit={handleSubmit(onSubmit)}
          className="w-full space-y-4"
        >
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
            data-testid="login-button"
            className="w-full h-11 bg-[#2254C5] hover:bg-[#1e4ab0] text-white rounded-md"
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? <LoadingSpinner className="h-5 w-5" /> : 'Masuk'}
          </Button>

          {error && (
            <p className="text-red-500 font-semibold text-sm text-center mt-2">
              {error}
            </p>
          )}
        </form>

        <p className="text-sm mt-4">
          Belum punya akun?{' '}
          <Link href="/auth/register" className="font-semibold underline text-black">
            Buat Akun
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;