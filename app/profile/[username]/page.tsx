import React from 'react';
import { fetchProfile, getProfile } from '@/lib/profile';
import ProfileComponent from '@/components/profile/ProfileComponent';
import { Team } from '@/components/profile';
import FAQ from '@/components/faq/FAQ'; // <-- Import FAQ


interface ProfilePageProps {
  params: { username: string };
}


const ProfilePage: React.FC<ProfilePageProps> = async ({ params }) => {
  const profile = await fetchProfile(params.username);
  const userProfile = await getProfile();
  const isUserSelf = userProfile?.user.id === profile.user.id
  const userRole = userProfile?.role ?? 'worker'


  if (!profile) {
    return (
      <div className='mt-20 w-full flex justify-center'>
        <div className='mt-20 w-[80%] text-center'>
          Profile not found
        </div>
      </div>
    )
  }


  return (
    <div className='flex flex-col mb-20 py-8'>
      <ProfileComponent isUserSelf={isUserSelf} profile={profile} />
      <Team userRole={userRole} isUserSelf={isUserSelf} username={params.username} />
      <FAQ /> {/* <-- Tambahin komponen FAQ di sini */}
    </div>
  );
};


export default ProfilePage;