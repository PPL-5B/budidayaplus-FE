'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AddForum from '@/components/forum/AddForum';
import { Forum } from '@/types/forum';
import ForumList from '@/components/forum/MyForumList';
import { ChevronLeft, Search, Filter } from 'lucide-react';

const ForumPage: React.FC = () => {
  const [refreshForums, setRefreshForums] = useState(0);
  const [updatedForum, setUpdatedForum] = useState<Forum | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState(''); 

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
    <div className="h-screen overflow-y-auto px-6 py-4 bg-[#EAF0FF] flex flex-col gap-4">
      {/* Tombol kembali */}
      <button
        onClick={() => router.push('/')}
        className="text-blue-600 text-sm flex items-center gap-1"
      >
        <ChevronLeft size={16} />
        Kembali
      </button>

      {/* Judul Forum */}
      <div className="text-center text-[#14142B] text-[24px] font-bold leading-[36px]">
        Daftar Forum
      </div>

      {/* Tombol Buat Forum */}
      <div className="w-[100px] h-[30px] relative shadow-sm">
        <AddForum onForumAdded={handleForumAdded} />
      </div>

      {/* Search dan Filter */}
      <div className="flex gap-4">
        {/* Search */}
        <div className="relative w-[180px] h-[30px]">
          <input
            type="text"
            placeholder="Cari Topik..."
            className="pl-9 pr-3 text-[14px] text-[#979797] font-medium bg-white rounded-full h-full w-full outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search className="absolute left-3 top-[7px] w-4 h-4 text-[#979797]" />
        </div>

        {/* Filter */}
        <div className="relative w-[110px] h-[30px]">
          <select
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
            className="pl-8 pr-3 text-[14px] text-[#979797] font-medium bg-white rounded-full h-full w-full appearance-none outline-none"
          >
            <option value="">Semua</option>
            <option value="ikan">Ikan</option>
            <option value="kolam">Kolam</option>
            <option value="siklus">Siklus</option>
            <option value="budidayaplus">BudidayaPlus</option>
          </select>
          <Filter className="absolute left-3 top-[7px] w-4 h-4 text-[#979797]" />
        </div>
      </div>

      {/* List Forum */}
      <ForumList
        refresh={refreshForums}
        updatedForum={updatedForum}
        searchQuery={searchQuery}
        selectedTag={selectedTag}
      />
    </div>
  );
};

export default ForumPage;
