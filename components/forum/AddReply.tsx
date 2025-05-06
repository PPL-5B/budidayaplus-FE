'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosAdd } from 'react-icons/io';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
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
          <Button className="flex text-sm" variant="outline" size="sm">
            <IoIosAdd size={20} className="mr-1" />
            Add Reply
          </Button>
        </DialogTrigger>
        <DialogContent title="Reply to Forum">
          <ReplyForm
            setIsModalOpen={setIsModalOpen}
            parentForumId={parentForumId}
            onReplyAdded={onReplyAdded}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddReply;
