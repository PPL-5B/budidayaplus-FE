"use client";

import React, { useState } from 'react';
import ForumList from '@/components/forum/forumList';
import AddForum from '@/components/forum/AddForum';

const ForumPage: React.FC = () => {
  const [refreshForums, setRefreshForums] = useState(0);

  // Callback to refresh the forum list after a new forum is added.
  const handleForumAdded = () => {
    setRefreshForums((prev) => prev + 1);
  };

  return (
    <div className="h-screen overflow-y-auto p-8 pb-40">
      <div className="flex items-center justify-between mb-5 mt-5">
        <h1 className="text-3xl leading-7 font-semibold text-[#2154C5]">
          Daftar Forum
        </h1>
        <AddForum onForumAdded={handleForumAdded} />
      </div>
      <ForumList refresh={refreshForums} />
    </div>
  );
};

export default ForumPage;
