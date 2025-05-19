import React, { } from 'react';
import { fetchProfile, getProfile } from '@/lib/profile';
import ProfileComponent from '@/components/profile/ProfileComponent';
import { Team } from '@/components/profile';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { DialogContentNoX } from '@/components/ui/dialog-content-no-x';
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
    <div className="min-h-screen bg-[#EAF0FF] flex flex-col py-8">
      <ProfileComponent isUserSelf={isUserSelf} profile={profile} />
      <Team userRole={userRole} isUserSelf={isUserSelf} username={params.username} />
      <div className="mt-12 px-6 text-center text-sm">
      <p className="text-[#3B3B3B]">Punya kendala?</p>

      <Dialog>
        <DialogTrigger asChild>
          <button className="text-[#3B3B3B] font-semibold hover:underline">
            Hubungi Kami Disini.
          </button>
        </DialogTrigger>

        <DialogContentNoX className="p-0 bg-transparent shadow-none">
          <div className="relative flex items-center justify-center w-full mb-4" />
          <WhatsAppContactForm />
        </DialogContentNoX>
      </Dialog>
    </div>
    </div>
  );
};

export default ProfilePage;