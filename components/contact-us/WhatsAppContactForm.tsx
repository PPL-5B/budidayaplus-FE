'use client';
import React, { useState, useEffect } from 'react';
import { ContactFormInput, ContactFormSchema } from '@/types/contact-us/contact';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getUser } from '@/lib/auth';
import User from '@/types/auth/user';
import { IoLogoWhatsapp } from 'react-icons/io';

interface ContactFormProps {
  setIsSubmitted?: (submitted: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ setIsSubmitted }) => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [userData, setUserData] = useState<User | null>(null);
 
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setValue
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
    if (!userData) {
      setErrorMessage('Data pengguna tidak tersedia. Silakan coba lagi nanti.');
      return;
    }
    
    try {
      const message = `Nama: ${userData.first_name} ${userData.last_name}%0ANomor: ${userData.phone_number}%0APesan: ${data.message}`;
      const whatsappUrl = `https://wa.me/6281287998495?text=${message}`;

      window.open(whatsappUrl, '_blank');
     
      reset();
      setIsSuccess(true);
      setErrorMessage(null);
     
      if (setIsSubmitted) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error('Gagal mengirim pesan:', error);
      setErrorMessage('Terjadi kesalahan saat mengirim pesan. Silakan coba lagi.');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4 flex items-center">
        Via WhatsApp <IoLogoWhatsapp size={20} className='ml-1'/>
      </h2>
      
      {isSuccess && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">
          Terima kasih! Silakan lanjutkan percakapan di WhatsApp.
        </div>
      )}
     
      <form className="grid grid-cols-1 gap-4" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label className="text-sm" htmlFor="name">Nama Lengkap</Label>
          <Input id="name" value={userData ? `${userData.first_name} ${userData.last_name}` : ''} type="text" disabled className="bg-gray-100" />
        </div>
       
        <div>
          <Label className="text-sm" htmlFor="phone_number">Nomor Telpon</Label>
          <Input id="phone_number" value={userData?.phone_number ?? ''} type="tel" disabled className="bg-gray-100" />
        </div>
       
        <div>
          <Label className="text-sm" htmlFor="message">Pesan</Label>
          <Textarea id="message" {...register('message')} placeholder="Tulis pesan Anda di sini" rows={4} />
          {errors.message && <span className="text-red-500 text-xs">{errors.message.message}</span>}
        </div>
       
        {errorMessage && (
          <div className="text-red-500 text-sm" data-testid="error-message">{errorMessage}</div>
        )}
       
        <Button className='flex bg-blue-500 hover:bg-blue-500' type="submit" disabled={isSubmitting}>Kirim Pesan</Button>
      </form>
    </div>
  );
};

export default ContactForm;
