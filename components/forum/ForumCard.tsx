// components/forum/ForumCard.tsx
'use client';

import React, { useState } from 'react';
import { Forum } from '@/types/forum';
import { ChevronRight } from 'lucide-react';
import DeleteForumContainer from './DeleteForumContainer';
import { useRouter } from 'next/navigation';
import ForumCardHeader from './ForumCardHeader';
import { goToForumDetail } from '@/lib/forum/forumNavigation';
import ForumCardFooter from './ForumCardFooter';

interface ForumCardProps {
  forum: Forum;
  onDeleteSuccess?: (id: string) => void;
}

const ForumCard: React.FC<ForumCardProps> = ({ forum, onDeleteSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState(forum.description);
  const [desc, setDesc] = useState(forum.description);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const router = useRouter();

  const handleSave = () => {
    setDesc(tempDesc);
    setIsEditing(false);
  };

  const handleViewDetails = () => {
    goToForumDetail(forum);
    router.push(`/forum/${forum.id}`);
  };

  return (
    <div className="relative w-full max-w-[338px] h-[120px] bg-white rounded-[10px] border-l border-r border-t-2 border-b-4 border-[#2254C5] p-3 shadow-sm hover:shadow-md transition-all duration-200">
      <ForumCardHeader timestamp={forum.timestamp} description={desc} />

      {isEditing ? (
        <>
          <textarea
            className="w-full border p-2 rounded text-[12px]"
            rows={2}
            value={tempDesc}
            onChange={(e) => setTempDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded text-[10px] hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setTempDesc(desc);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-300 text-black rounded text-[10px] hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </>
      ) : (
        <p className="text-[12px] text-[#646464] line-clamp-2 mb-2">{desc}</p>
      )}

      <ForumCardFooter
        userInitial={forum.user.first_name.charAt(0)}
        onViewDetails={handleViewDetails}
        onEdit={() => setIsEditing(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isEditing={isEditing}
      />

      <DeleteForumContainer
        forumId={forum.id}
        forumTitle={desc}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => {
          onDeleteSuccess?.(forum.id);
        }}
      />
    </div>
  );
};

export default ForumCard;
