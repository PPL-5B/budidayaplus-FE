import React, { useState } from 'react';
import { fetchProfile, getProfile } from '@/lib/profile';
import ProfileComponent from '@/components/profile/ProfileComponent';
import { Team } from '@/components/profile';
import FAQ from '@/components/faq/FAQ';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DialogContentNoX } from '@/components/ui/dialog-content-no-x';
import BigButton from '@/components/ui/big-button';
import { IoLogoWhatsapp } from 'react-icons/io';
import WhatsAppContactForm from '@/components/contact-us/WhatsAppContactForm';

interface ProfilePageProps {
  params: { username: string };
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const profile = await fetchProfile(params.username);
  const userProfile = await getProfile();
  const isUserSelf = userProfile?.user.id === profile?.user.id;
  const userRole = userProfile?.role ?? 'worker';

  if (!profile) {
    return (
      <div className="min-h-screen bg-[#EAF0FF] flex flex-col items-center justify-center">
        <div className="text-center">
          Profile not found
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#EAF0FF] flex flex-col mb-20 py-8">
      <ProfileComponent isUserSelf={isUserSelf} profile={profile} />
      <Team userRole={userRole} isUserSelf={isUserSelf} username={params.username} />
      <FAQ />

      {/* Heading baru untuk Hubungi Kami */}
      <div className="mt-12 px-6">
        <h2 className="text-2xl font-bold text-left mb-4">Hubungi Kami</h2>

        {/* Dialog popup untuk form */}
        <Dialog>
          <DialogTrigger asChild>
            <BigButton
              icon={<IoLogoWhatsapp size={24} />}
              text="Hubungi Kami"
            />
          </DialogTrigger>

          <DialogContentNoX>
            <div className="relative flex items-center justify-center w-full mb-4">
              <h2 className="text-[#2254C5] text-lg font-bold text-center">
              </h2>
            </div>

            <WhatsAppContactForm />
          </DialogContentNoX>
        </Dialog>
      </div>
    </div>
  );
};

export default ProfilePage;
