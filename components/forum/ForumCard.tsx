'use client';

import React, { useState } from 'react';
import { Forum } from '@/types/forum';
import { ChevronRight } from 'lucide-react';
import DeleteForumContainer from './DeleteForumContainer';
import { useRouter } from 'next/navigation';

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
    <div className="w-full border rounded-lg p-4 shadow-md bg-white hover:bg-gray-100 transition duration-200 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        Dibuat oleh: {forum.user.first_name + ' ' + forum.user.last_name}
      </h2>
      <h3 className="text-gray-600">
        Tanggal: {new Date(forum.timestamp).toLocaleString()}
      </h3>

      {isEditing ? (
        <>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={tempDesc}
            onChange={(e) => setTempDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setTempDesc(desc);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600">{desc}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-500 font-medium hover:underline"
              >
                Edit deskripsi
              </button>
              
              <button
                onClick={() => setIsDeleteOpen(true)}
                className="text-sm text-red-500 font-medium hover:underline"
              >
                Hapus forum
              </button>
            </div>
            <button
              onClick={handleViewDetails}
              className="flex items-center text-sm text-blue-500 font-medium hover:underline"
            >
              Lihat detail forum
              <ChevronRight className="w-5 h-5 ml-1 text-[#ff8585]" />
            </button>
          </div>
        </>
      )}

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
