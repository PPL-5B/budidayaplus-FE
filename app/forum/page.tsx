'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AddForum from '@/components/forum/AddForum';
import { Forum } from '@/types/forum';
import ForumList from '@/components/forum/MyForumList';

const ForumPage: React.FC = () => {
  const [refreshForums, setRefreshForums] = useState(0);
  const [updatedForum, setUpdatedForum] = useState<Forum | null>(null);

  const searchParams = useSearchParams();
  const router = useRouter();

  // Callback to refresh the forum list after a new forum is added.
  const handleForumAdded = () => {
    setRefreshForums((prev) => prev + 1);
  };

  // Parse query param if ada forum yang diupdate
  useEffect(() => {
    const updated = searchParams.get('updated');
    const id = searchParams.get('id');
    const desc = searchParams.get('desc');

    if (updated === 'true' && id && desc) {
      setUpdatedForum({
        id,
        description: decodeURIComponent(desc),
      } as Forum);

      // Bersihkan query param agar tidak update terus
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('updated');
      newParams.delete('id');
      newParams.delete('desc');
      router.replace(`/forum?${newParams.toString()}`);
    }
  }, [searchParams, router]);

  return (
    <div className="h-screen overflow-y-auto p-8 pb-40">
      <div className="flex items-center justify-between mb-5 mt-5">
        <h1 className="text-3xl leading-7 font-semibold text-[#2154C5]">
          Daftar Forum
        </h1>
        <AddForum onForumAdded={handleForumAdded} />
      </div>
      <ForumList refresh={refreshForums} updatedForum={updatedForum} />
    </div>
  );
};

export default ForumPage;