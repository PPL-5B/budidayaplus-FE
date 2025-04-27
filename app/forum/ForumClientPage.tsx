'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AddForum from '@/components/forum/AddForum';
import { Forum } from '@/types/forum';
import ForumList from '@/components/forum/MyForumList';
import Frame from '@/src/assets/Frame.svg';
import { ChevronLeft } from 'lucide-react';


const ForumPage: React.FC = () => {
  const [refreshForums, setRefreshForums] = useState(0);
  const [updatedForum, setUpdatedForum] = useState<Forum | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

    <button
          onClick={() => router.push('/')}
          className="flex items-center text-sm text-blue-600 hover:underline mb-3"
        >
          <ChevronLeft size={16} className="mr-1" />
          Kembali
    </button>

    <div className="flex items-center justify-between mb-5 mt-5">
      {/* Kiri: Ikon + Teks */}
      <div className="flex items-center gap-2">
        <Frame className="w-[30px] h-[30px]" />
        <h1 className="text-[24px] font-bold leading-[36px] text-[#14142B]">
          Daftar Forum
        </h1>
      </div>
      <AddForum onForumAdded={handleForumAdded}/>
    </div>

      {/* 🔍 Search Box */}
      <div className="mb-5">
        <div className="flex items-center w-[300px] h-[38px] rounded-full bg-white px-4 shadow-sm">
          <svg
            className="w-[16px] h-[16px] text-[#979797]"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"
            />
          </svg>
          <input
            type="text"
            placeholder="Cari Topik..."
            className="ml-3 w-full outline-none text-[#979797] placeholder:text-[#979797] text-[16px] capitalize font-normal bg-transparent"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>
  
    {/*Forum list di luar search box */}
    <ForumList refresh={refreshForums} updatedForum={updatedForum} searchQuery={searchQuery}/>
  </div>
  )
}
  

export default ForumPage;