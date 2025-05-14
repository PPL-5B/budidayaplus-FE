'use client';

import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Modal as DialogContent } from '@/components/ui/modal';
import ForumForm from '@/components/forum/ForumForm';

interface AddForumProps {
  parentForumId?: string;
  onForumAdded?: () => void;
  isReply?: boolean;
}

const AddForum: React.FC<AddForumProps> = ({
  parentForumId,
  onForumAdded,
  isReply = false,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div data-testid="add-forum">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center justify-center gap-2 px-4 h-[30px] bg-white rounded-md shadow text-[#2254C5] font-semibold text-[14px] whitespace-nowrap">
            {/* SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="text-[#2254C5]"
            >
              <path d="M21 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5v2H5v14h14v-5z" />
              <path d="M21 7h-4V3h-2v4h-4v2h4v4h2V9h4z" />
            </svg>
            Buat Forum
          </button>
        </DialogTrigger>


        <DialogContent
          title=""
          className="p-0 bg-[#EAF0FF] border-0 shadow-none rounded-md"
        >
          <ForumForm
            setIsModalOpen={setIsModalOpen}
            parentForumId={parentForumId}
            onForumAdded={onForumAdded}
            isReply={isReply}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddForum;
