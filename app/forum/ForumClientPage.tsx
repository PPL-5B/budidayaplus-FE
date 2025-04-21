'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AddForum from '@/components/forum/AddForum';
import { Forum } from '@/types/forum';
import ForumList from '@/components/forum/MyForumList';
import Frame from '@/src/assets/Frame.svg';


const ForumPage: React.FC = () => {
  const [refreshForums, setRefreshForums] = useState(0);
  const [updatedForum, setUpdatedForum] = useState<Forum | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  const handleForumAdded = () => {
    setRefreshForums((prev) => prev + 1);
  };

  useEffect(() => {
    const updated = searchParams.get('updated');
    const id = searchParams.get('id');
    const desc = searchParams.get('desc');

    if (updated === 'true' && id && desc) {
      setUpdatedForum({
        id,
        description: decodeURIComponent(desc),
      } as Forum);

      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('updated');
      newParams.delete('id');
      newParams.delete('desc');
      router.replace(`/forum?${newParams.toString()}`);
    }
  }, [searchParams, router]);

  return (
  <div className="h-screen overflow-y-auto p-8 pb-40 bg-[#EAF0FF]">
    <div className="flex items-center justify-between mb-5 mt-5">
      {/* Kiri: Ikon + Teks */}
      <div className="flex items-center gap-2">
        <Frame className="w-[30px] h-[30px]" />
        <h1 className="text-[24px] font-bold leading-[36px] text-[#14142B]">
          Daftar Forum
        </h1>
      </div>
      <AddForum onForumAdded={handleForumAdded} />
    </div>
  
    {/*Forum list di luar search box */}
    <ForumList refresh={refreshForums} updatedForum={updatedForum} />
  </div>
  )
}
  

export default ForumPage;
