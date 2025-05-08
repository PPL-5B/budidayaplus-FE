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

interface ForumCardProps {
  forum: Omit<Forum, 'timestamp'> & {
    timestamp: Date | string; 
  };
  onDeleteSuccess?: (id: string) => void;
  onVoteSuccess?: (updatedForum: Forum) => void;
  onUpdateSuccess?: (updatedForum: Forum) => void;
}

const ForumCard: React.FC<ForumCardProps> = ({
  forum: originalForum,
  onDeleteSuccess,
  onVoteSuccess,
  onUpdateSuccess,
}) => {
  const forum = {
    ...originalForum,
    timestamp: originalForum.timestamp instanceof Date 
      ? originalForum.timestamp 
      : new Date(originalForum.timestamp)
  };

  const [isEditing, setIsEditing] = useState(false);
  const [desc, setDesc] = useState(forum.description);
  const [title, setTitle] = useState(forum.title);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  const { goToDetail } = useForumNavigation();
  const user = useUser();

  const {
    upvotes,
    downvotes,
    userVote,
    isLoading,
    isInitialized,
    handleUpvote,
    handleDownvote,
    handleCancelVote,
  } = useVote(forum.id);

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

  const isOwner = !!(user && forum?.user?.id === user.id);

  const handleViewDetails = () => {
    goToDetail(forum);
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      if (voteType === 'upvote') {
        userVote === 'upvote' ? await handleCancelVote() : await handleUpvote();
      } else {
        userVote === 'downvote' ? await handleCancelVote() : await handleDownvote();
      }

      onVoteSuccess?.({
        ...forum,
        upvotes,
        downvotes,
      });
    } catch (error) {
      console.error('Error voting:', error);
    }
  };

  if (!isInitialized) {
    return (
      <div className="w-full border rounded-lg p-4 shadow-md bg-white text-sm text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-[338px] min-h-[150px] bg-white rounded-[10px] border-l border-r border-t-2 border-b-4 border-[#2254C5] p-3 shadow-sm hover:shadow-md transition-all duration-200">
      <ForumCardHeader
        title={title}
        timestamp={forum.timestamp} 
      />

      {isEditing ? (
        <div className="mb-8">
          <EditForumForm
            forumId={forum.id}
            initialTitle={title}
            initialDesc={desc}
            onUpdateSuccess={handleUpdateSuccess}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <p className="text-[12px] text-[#646464] whitespace-pre-line mb-2">
          {desc}
        </p>
      )}

      <ForumCardFooter
        onViewDetails={handleViewDetails}
        userInitial={forum?.user?.first_name?.charAt(0) ?? '?'}
        onEdit={() => setIsEditing(true)}
        onDelete={() => setIsDeleteOpen(true)}
        isEditing={isEditing}
        tag={forum.tag}
        upvotes={upvotes}
        downvotes={downvotes}
        userVote={userVote === 'upvote' || userVote === 'downvote' ? userVote : null}
        handleVote={handleVote}
        isLoading={isLoading}
        isOwner={isOwner}
      />

      <DeleteForumContainer
        forumId={forum.id}
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onSuccess={() => {
          onDeleteSuccess?.(forum.id);
        }}
      />
    </div>
  );
};

export default ForumCard;
