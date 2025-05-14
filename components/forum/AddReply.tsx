'use client';

import React, { useState } from 'react';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Modal } from '@/components/ui/modal';
import ReplyForm from '@/components/forum/ReplyForm';

interface AddReplyProps {
  parentForumId: string;
  onReplyAdded?: () => void;
}

const AddReply: React.FC<AddReplyProps> = ({ parentForumId, onReplyAdded }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div data-testid="add-reply">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <button className="flex items-center justify-center gap-2 px-4 h-[30px] bg-white rounded-md shadow text-[#2254C5] font-bold text-[14px] whitespace-nowrap">
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
            Tambah Balasan
          </button>
        </DialogTrigger>

        <Modal>
          <ReplyForm
            setIsModalOpen={setIsModalOpen}
            parentForumId={parentForumId}
            onReplyAdded={onReplyAdded}
          />
        </Modal>
      </Dialog>
    </div>
  );
};

export default AddReply;