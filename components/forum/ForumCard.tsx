'use client';

import React, { useState } from 'react';
import { Forum } from '@/types/forum';
import { useRouter } from 'next/navigation';
import DeleteForumContainer from './DeleteForumContainer';

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
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedForum', JSON.stringify(forum));
      router.push(`/forum/${forum.id}`);
    }
  };

  return (
    <div className="relative w-full max-w-[338px] h-[120px] bg-white rounded-[10px] border-l border-r border-t-2 border-b-4 border-[#2254C5] p-3 shadow-sm hover:shadow-md transition-all duration-200">
      {/* Judul */}
      <h2 className="text-[12px] font-bold text-black mb-1 line-clamp-1">
        Dibuat oleh: {forum.user.first_name + ' ' + forum.user.last_name}
      </h2>

      {/* Tanggal */}
      <h3 className="text-gray-600 text-[10px] mb-1">
        {new Date(forum.timestamp).toLocaleString()}
      </h3>

      {/* Deskripsi atau Textarea */}
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

      {/* Footer: Lihat Unggahan */}
      <div className="absolute bottom-2 left-3 flex items-center gap-2">
        <button
          className="px-2 py-[2px] bg-[#2254C5] rounded-full text-white text-[8px] font-medium hover:brightness-110 transition"
          onClick={handleViewDetails}
        >
          Lihat Unggahan
        </button>
      </div>

      {/* Edit & Hapus */}
      {!isEditing && (
        <div className="absolute bottom-2 right-3 flex gap-2">
          <button
            onClick={() => setIsEditing(true)}
            className="text-[10px] text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={() => setIsDeleteOpen(true)}
            className="text-[10px] text-red-500 hover:underline"
          >
            Hapus
          </button>
        </div>
      )}

      {/* Avatar */}
      <div className="absolute top-2 right-3 w-10 h-10 rounded-full bg-[#2254C5] flex items-center justify-center text-white text-[12px] font-bold">
        {forum.user.first_name.charAt(0)}
      </div>

      {/* Delete Modal */}
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
