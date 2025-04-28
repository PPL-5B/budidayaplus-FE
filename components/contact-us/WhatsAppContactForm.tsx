'use client';

import React, { useState, useEffect } from 'react';
import { ContactFormInput, ContactFormSchema } from '@/types/contact-us/contact';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getUser } from '@/lib/auth';
import User from '@/types/auth/user';
import { IoPerson, IoCall, IoChatbubble } from 'react-icons/io5';
import IconChevronFilled from '@/components/ui/icon-chevron-filled';
import { NewButton } from '@/components/ui/new-button';

interface WhatsAppContactFormProps {
  setIsSubmitted?: (submitted: boolean) => void;
  setIsModalOpen?: (open: boolean) => void;
}

const WhatsAppContactForm: React.FC<WhatsAppContactFormProps> = ({ setIsSubmitted, setIsModalOpen }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue,
  } = useForm<ContactFormInput>({
    resolver: zodResolver(ContactFormSchema),
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const user = await getUser();
        if (user) {
          setUserData(user);
          setValue('name', `${user.first_name} ${user.last_name}`.trim());
          setValue('phone_number', user.phone_number);
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      }
    };
    loadUserData();
  }, [setValue]);

  const onSubmit = async (data: ContactFormInput) => {
    try {
      const message = `Nama: ${userData?.first_name} ${userData?.last_name}%0ANomor: ${userData?.phone_number}%0APesan: ${data.message}`;
      const whatsappUrl = `https://wa.me/6281287998495?text=${message}`;

      window.open(whatsappUrl, '_blank');
      reset();
      setIsSuccess(true);
      setErrorMessage(null);

      if (setIsSubmitted) {
        setIsSubmitted(true);
      }

      setIsModalOpen?.(false);
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
      setErrorMessage('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center py-0 bg-[#EAF0FF] rounded-xl p-2 w-full max-w-md mx-auto">
      <div className="relative flex items-center justify-center w-full mb-2">
        <button
          type="button"
          onClick={() => {
            if (setIsModalOpen) {
              setIsModalOpen(false);
            } else {
              window.location.href = `/profile/${userData?.phone_number}`;
            }
          }}
          className="absolute left-0 text-[#2254C5]"
        >
          <IconChevronFilled className="h-6 w-6 rotate-[90deg]" fill="#2254C5" />
        </button>

        <h2 className="text-[#2254C5] text-lg font-bold text-center">
          Hubungi Kami
        </h2>
      </div>

      <form className="flex flex-col gap-2 w-full" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-col gap-0.5 w-full">
          <Label htmlFor="name" className="flex items-center gap-2 text-[#2254C5]">
            <IoPerson className="h-4 w-4" />
            Nama Lengkap
          </Label>
          <Input
            id="name"
            type="text"
            value={userData ? `${userData.first_name} ${userData.last_name}` : ''}
            disabled
            className="bg-[#CFCFCE] text-black"
          />
        </div>

        <div className="flex flex-col gap-0.5 w-full">
          <Label htmlFor="phone_number" className="flex items-center gap-2 text-[#2254C5]">
            <IoCall className="h-4 w-4" />
            Nomor Ponsel
          </Label>
          <Input
            id="phone_number"
            type="tel"
            value={userData?.phone_number ?? ''}
            disabled
            className="bg-[#CFCFCE] text-black"
          />
        </div>

        <div className="flex flex-col gap-0.5 w-full">
          <Label htmlFor="message" className="flex items-center gap-2 text-[#2254C5]">
            <IoChatbubble className="h-4 w-4" />
            Pesan
          </Label>
          <Textarea
            id="message"
            {...register('message')}
            placeholder="Tulis pesan Anda di sini"
            rows={3}
            className="bg-[#E6E6E5] text-black"
          />
          {errors.message && (
            <p className="text-red-500 text-xs">{errors.message.message}</p>
          )}
        </div>

        {errorMessage && (
          <div className="text-red-500 text-xs" data-testid="error-message">
            {errorMessage}
          </div>
        )}

        <NewButton
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-2"
        >
          Submit
        </NewButton>
      </form>
    </div>
  );
};

export default WhatsAppContactForm;