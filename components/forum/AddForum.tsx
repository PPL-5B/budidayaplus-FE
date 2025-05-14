'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosAdd } from 'react-icons/io';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import { Modal as DialogContent } from '@/components/ui/modal'; // Modal tetap dipakai
import ForumForm from '@/components/forum/ForumForm';

interface AddForumProps {
  parentForumId?: string;
  onForumAdded?: () => void;
  isReply?: boolean;
}

const AddForum: React.FC<AddForumProps> = ({ parentForumId, onForumAdded, isReply = false }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div data-testid="add-forum">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex text-sm" variant="outline" size="sm">
            <IoIosAdd size={20} className="mr-1" />
            {isReply ? 'Reply' : 'Add Forum'}
          </Button>
        </DialogTrigger>

        <DialogContent
          title=""
          className="p-0 bg-[#EAF0FF] border-0 shadow-none rounded-md"
        >
          {/* Force hidden close button */}
          <div className="relative w-full">
            <ForumForm
              setIsModalOpen={setIsModalOpen}
              parentForumId={parentForumId}
              onForumAdded={onForumAdded}
              isReply={isReply}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddForum;
