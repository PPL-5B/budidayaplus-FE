'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { IoIosAdd } from 'react-icons/io';
import { Modal as DialogContent } from '@/components/ui/modal';
import { Dialog, DialogTrigger } from '@/components/ui/dialog';
import ForumForm from '@/components/forum/ForumForm';

interface AddForumProps extends React.HTMLAttributes<HTMLDivElement> {
  parentForumId?: string;
  onForumAdded?: () => void;
}

const AddForum: React.FC<AddForumProps> = ({ parentForumId, onForumAdded, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div {...props} data-testid="add-forum">
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogTrigger asChild>
          <Button className="flex text-sm" variant="outline" size="sm">
            <IoIosAdd size={20} className="mr-1" />
            Add Forum
          </Button>
        </DialogTrigger>
        <DialogContent title="Create Forum">
          <ForumForm
            setIsModalOpen={setIsModalOpen}
            parentForumId={parentForumId}
            onForumAdded={onForumAdded}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddForum;
