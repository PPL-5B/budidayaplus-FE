'use client';

import React, { useState } from 'react';
import { Forum } from '@/types/forum';
import DeleteForumContainer from './DeleteForumContainer';
import ForumCardHeader from './ForumCardHeader';
import ForumCardFooter from './ForumCardFooter';
import { useVote } from '@/hooks/useVote';
import { useUser } from '@/hooks/useUser';
import { useForumNavigation } from '@/lib/forum/forumNavigation';
import EditForumForm from '@/components/forum/EditForum';
import { cn, truncateText } from '@/lib/utils';

interface ForumCardProps {
  forum: Forum;
  onDeleteSuccess?: (id: string) => void;
  onVoteSuccess?: (updatedForum: Forum) => void;
  onUpdateSuccess?: (updatedForum: Forum) => void;
}

const ForumCard: React.FC<ForumCardProps> = ({ forum, onDeleteSuccess, onVoteSuccess, onUpdateSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(forum.description);
  const [title, setTitle] = useState(forum.title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { goToDetail } = useForumNavigation();
  const user = useUser();

  const {
    upvotes,
    userVote,
    isLoading,
    isInitialized,
    handleUpvote,
    handleCancelVote,
  } = useVote(forum.id);

  const isOwner = !!(user && forum.user.id === user.id);

  const handleUpdateSuccess = (updatedDesc: string, updatedTitle: string) => {
    setDesc(updatedDesc);
    setTitle(updatedTitle);
    setIsEditing(false);
    onUpdateSuccess?.({
      ...forum,
      description: updatedDesc,
      title: updatedTitle,
    });
  };

  const handleViewDetails = () => {
    goToDetail(forum);
  };

  const handleVote = async () => {
    try {
      userVote === 'upvote' ? await handleCancelVote() : await handleUpvote();
      onVoteSuccess?.({
        ...forum,
        upvotes,
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (!isInitialized) {
    return <div className="w-full rounded-lg p-4 shadow-md bg-white">Loading...</div>;
  }

  return (
    <div className="relative w-full max-w-[338px] bg-white rounded-[10px] shadow-md p-4 transition-all duration-200 overflow-hidden">
      <ForumCardHeader
        title={title}
        timestamp={forum.timestamp}
        author={forum.user.first_name}
        tag={forum.tag}
      />

      {isEditing ? (
        <EditForumForm
          forumId={forum.id}
          initialTitle={title}
          initialDesc={desc}
          onUpdateSuccess={handleUpdateSuccess}
          onCancel={() => setIsEditing(false)}
        />
      ) : (
        <p className="text-[14px] font-semibold text-[#646464] whitespace-pre-line mb-2">
          {truncateText(desc, 100)} {/* Contoh: batas deskripsi 150 karakter */}
        </p>
      )}

      <div className={cn(
        'mt-2',
        isOwner ? 'w-[166px]' : 'w-[140px]'
      )}>
        <ForumCardFooter
          onViewDetails={handleViewDetails}
          onEdit={() => setIsEditing(true)}
          onDelete={() => setIsDeleteOpen(true)}
          isEditing={isEditing}
          upvotes={upvotes}
          userVote={userVote === 'upvote' ? userVote : null}
          handleVote={handleVote}
          isLoading={isLoading}
          isOwner={isOwner}
        />
      </div>

      <DeleteForumContainer
        forumId={forum.id}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => onDeleteSuccess?.(forum.id)}
      />
    </div>
  );
};

export default ForumCard;

