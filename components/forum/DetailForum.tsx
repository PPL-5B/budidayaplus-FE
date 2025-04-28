'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface ForumDetailProps {
  forum: {
    id: string;
    description: string;
    timestamp: string;
    user: {
      first_name: string;
      last_name: string;
      phone_number: string;
    };
  };
}

const DetailForum: React.FC<{ forum: ForumDetailProps['forum'] }> = ({ forum }) => {
  const tanggal = new Date(forum.timestamp).toLocaleDateString();
  const jam = new Date(forum.timestamp).toLocaleTimeString();
  const router = useRouter();

  return (
    <div className="flex flex-col items-center mt-6 px-4">
      <div className="relative w-full max-w-[600px] bg-white rounded-[10px] border-l border-r border-t-2 border-b-4 border-[#2254C5] p-4 shadow-sm">
        
        {/* Bubble inisial user */}
        <div className="absolute top-4 right-4 w-10 h-10 rounded-full bg-[#2254C5] flex items-center justify-center text-white text-[12px] font-bold">
          {forum.user.first_name.charAt(0)}
        </div>

        {/* Tombol kembali */}
        <button
          onClick={() => router.push('/forum')}
          className="flex items-center text-sm text-blue-600 hover:underline mb-3"
        >
          <ChevronLeft size={16} className="mr-1" />
          Kembali ke Forum
        </button>

        {/* Isi Detail */}
        <div className="text-[13px] text-[#333] space-y-1">
          <p><strong>Username:</strong> {forum.user.first_name}</p>
          <p><strong>Email:</strong> {forum.user.last_name}</p>
          <p><strong>Tanggal Pembuatan:</strong> {tanggal}</p>
          <p><strong>Jam Pembuatan:</strong> {jam}</p>
          <p><strong>Deskripsi Forum:</strong></p>
          <p className="text-[#646464] whitespace-pre-line">{forum.description}</p>
        </div>
      </div>
    </div>
  );
};

export default DetailForum;
