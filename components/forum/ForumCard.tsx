import React from 'react';
import { Forum } from '@/types/forum';
import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';

interface ForumCardProps {
  forum: Forum;
}

const ForumCard: React.FC<ForumCardProps> = ({ forum }) => {
  const router = useRouter();
  
  const handleClick = () => {
    router.push(`/forum/${forum.id}`);
  };
  
  const formattedDate = new Date(forum.timestamp).toLocaleString('id-ID', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  return (
    <div className="w-full border rounded-lg p-4 shadow-md bg-white hover:bg-gray-100 transition duration-200 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        Dibuat oleh: {forum.user.first_name + ' ' + forum.user.last_name}
      </h2>
      <h3 className="text-gray-600">
        Tanggal: {formattedDate}
      </h3>
      <p className="text-gray-600">{forum.description}</p>
      <div className="flex justify-end items-center gap-2">
        <button className="text-sm text-blue-500 font-medium cursor-pointer hover:underline bg-transparent border-none p-0" onClick={handleClick}>
          Lihat detail forum
        </button>
        <ChevronRight
          className="w-6 h-6 text-[#ff8585] hover:text-[#ff8585] cursor-pointer"
          onClick={handleClick}
          aria-label="Navigate to forum"
        />
      </div>
    </div>
  );
};

export default ForumCard;