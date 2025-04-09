'use client';

import React, { useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import AddForum from '@/components/forum/AddForum';

const ForumPage: React.FC = () => {
  // Removed unused updatedForum state

  const searchParams = useSearchParams();
  const router = useRouter();

  // Callback to refresh the forum list after a new forum is added.
  const handleForumAdded = () => {
    // No-op for now
  };

  // Parse query param if ada forum yang diupdate
  useEffect(() => {
    const updated = searchParams.get('updated');
    const id = searchParams.get('id');
    const desc = searchParams.get('desc');

    if (updated === 'true' && id && desc) {
      // Removed setting updatedForum as it is no longer used

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
      {/* ForumList removed */}
    </div>
  );
};

export default ForumPage;
