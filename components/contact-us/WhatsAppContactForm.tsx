'use client';

import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { NewButton } from '@/components/ui/new-button';
import { X } from 'lucide-react';

import { getUser } from '@/lib/auth';
import { ContactFormInput, ContactFormSchema } from '@/types/contact-us/contact';
import User from '@/types/auth/user';

import { IoPerson, IoCall, IoChatbubble } from 'react-icons/io5';

interface WhatsAppContactFormProps {
  setIsSubmitted?: (submitted: boolean) => void;
  setIsModalOpen?: (open: boolean) => void;
}

const WhatsAppContactForm: React.FC<WhatsAppContactFormProps> = ({
  setIsSubmitted,
  setIsModalOpen,
}) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [userData, setUserData] = useState<User | null>(null);
  const [isSuccess, setIsSuccess] = useState(false); 

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

  const handleClose = () => {
    if (setIsModalOpen) {
      setIsModalOpen(false);
    } else if (userData?.phone_number) {
      window.location.href = `/profile/${userData.phone_number}`;
    } else {
      window.location.href = '/profile'; // fallback jika userData belum sempat terisi
    }
  };

  return (
    <div className="bg-[#F1F5FF] p-5 rounded-lg w-full max-w-xs mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-[#2254C5] font-semibold text-base">Hubungi Kami</h2>
        <button onClick={handleClose} aria-label="Tutup">
          <X className="text-[#2254C5] w-5 h-5" />
        </button>
      </div>

      <form className="flex flex-col gap-3" onSubmit={handleSubmit(onSubmit)}>
        {/* Nama */}
        <div className="flex flex-col gap-0.5">
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

        {/* Nomor HP */}
        <div className="flex flex-col gap-0.5">
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

        {/* Pesan */}
        <div className="flex flex-col gap-0.5">
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
            <p className="text-sm text-red-500 text-center">{errors.message.message}</p>
          )}
        </div>

        {/* Error */}
        {errorMessage && (
          <div className="text-sm text-red-500 text-center" data-testid="error-message">
            {errorMessage}
          </div>
        )}

        {/* Success */}
        {isSuccess && (
          <div className="text-sm text-green-500 text-center">
            Pesan berhasil dikirim!
          </div>
        )}

        {/* Submit */}
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

export default WhatsAppContactForm

