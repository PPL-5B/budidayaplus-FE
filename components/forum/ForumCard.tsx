'use client';

import React, { useState } from 'react';
import { Forum } from '@/types/forum';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface ForumCardProps {
  forum: Forum;
}

const ForumCard: React.FC<ForumCardProps> = ({ forum }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState(forum.description);
  const [desc, setDesc] = useState(forum.description); // versi yang akan ditampilkan

  const handleSave = () => {
    setDesc(tempDesc);     // Simpan perubahan ke tampilan utama
    setIsEditing(false);   // Tutup editor
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
                setTempDesc(desc); // Reset
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
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm text-blue-500 font-medium hover:underline"
            >
              Edit deskripsi
            </button>
            <Link
              href={`/forum/${forum.id}`}
              className="flex items-center text-sm text-blue-500 font-medium hover:underline"
            >
              Lihat detail forum
              <ChevronRight className="w-5 h-5 ml-1 text-[#ff8585]" />
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default ForumCard;
