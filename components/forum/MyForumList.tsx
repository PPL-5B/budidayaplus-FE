'use client';

import React, { useEffect, useState } from 'react';
import { getListForum } from '@/lib/forum/getListForum';
import { Forum } from '@/types/forum';
import ForumCard from './ForumCard';
import {filterForums}  from '@/components/forum/SearchForum';

interface ForumListProps {
  refresh?: number;
  updatedForum?: Forum | null;
  searchQuery?: string;
}

const ForumList: React.FC<ForumListProps> = ({ refresh = 0, updatedForum, searchQuery = '' }) => {
  const [forums, setForums] = useState<Forum[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

useEffect(() => {
  const fetchForums = async () => {
    try {
      setLoading(true);
      const data = await getListForum();
      const mainForums = data.filter((forum) => forum.parent_id === null);
      setForums(mainForums);
    } catch {
      setError('Gagal memuat forumm');
    } finally {
      setLoading(false);
    }
  };

  fetchForums();
}, [refresh]); // ✅ cuma akan jalan saat refreshForums berubah

  // Update lokal jika ada forum yang diupdate
  useEffect(() => {
    if (updatedForum) {
      setForums((prev) =>
        prev.map((f) =>
          f.id === updatedForum.id
            ? { ...f, description: updatedForum.description }
            : f
        )
      );
    }
  }, [updatedForum]);

  // Handler untuk menghapus forum dari list
  const handleDeleteSuccess = (deletedId: string) => {
    setForums((prev) => prev.filter((forum) => forum.id !== deletedId));
  };

  if (loading) return <p>Memuat Forum ...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const filteredForums = filterForums(forums, searchQuery);

  return (
    <div className="space-y-4">
      {filteredForums.length > 0 ? (
        filteredForums.map((forum) => (
          <ForumCard key={forum.id} forum={forum} onDeleteSuccess={handleDeleteSuccess} />
        ))
      ) : (
        <p className="text-gray-500">Forum tidak ditemukan.</p>
      )}
    </div>
  );
};

export default ForumList;