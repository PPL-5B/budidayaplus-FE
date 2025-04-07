'use client';

import React, { useEffect, useState } from 'react';
import { getListForum } from '@/lib/forum/getListForum';
import { Forum } from '@/types/forum';
import ForumCard from './ForumCard';

interface ForumListProps {
  refresh?: number;
}

const ForumList: React.FC<ForumListProps> = ({ refresh = 0 }) => {
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
  }, [refresh]);

  if (loading) return <p>Memuat Forum ...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="space-y-4">
      {forums.length > 0 ? (
        forums.map((forum) => <ForumCard key={forum.id} forum={forum} />)
      ) : (
        <p className="text-gray-500">Tidak ada forum yang tersedia.</p>
      )}
    </div>
  );
};

export default ForumList;
