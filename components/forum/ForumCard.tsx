'use client';

import React, { useState } from 'react';
import { Forum } from '@/types/forum';
import DeleteForumContainer from './DeleteForumContainer';
import ForumCardHeader from './ForumCardHeader';
import ForumCardFooter from './ForumCardFooter';
import { useVote } from '@/hooks/useVote';
import { useUser } from '@/hooks/useUser';
import { useForumNavigation } from '@/lib/forum/forumNavigation';
import { cn } from '@/lib/utils';

interface ForumCardProps {
  forum: Forum;
  onDeleteSuccess?: (id: string) => void;
  onVoteSuccess?: (updatedForum: Forum) => void;
}

const ForumCard: React.FC<ForumCardProps> = ({ forum, onDeleteSuccess, onVoteSuccess }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempDesc, setTempDesc] = useState(forum.description);
  const [desc, setDesc] = useState(forum.description);
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
    handleCancelVote,
  } = useVote(forum.id);

  const isOwner = !!(user && forum.user.id === user.id);

  const handleSave = () => {
    setDesc(tempDesc);
    setIsEditing(false);
    onVoteSuccess?.({
      ...forum,
      description: tempDesc,
    });
  };

  const handleViewDetails = () => {
    goToDetail(forum);
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      if (voteType === 'upvote') {
        userVote === 'upvote' ? await handleCancelVote() : await handleUpvote();
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
    return <div className="w-full rounded-lg p-4 shadow-md bg-white">Loading...</div>;
  }

  return (
    <div className="relative w-full max-w-[338px] bg-white rounded-[10px] shadow-md p-4 transition-all duration-200 overflow-hidden">
      {/* Header */}
      <ForumCardHeader
        title={forum.title}
        timestamp={forum.timestamp}
        author={forum.user.first_name}
      />

      {/* Description */}
      {isEditing ? (
        <>
          <textarea
            className="w-full border p-2 rounded text-[12px]"
            rows={2}
            value={tempDesc}
            onChange={(e) => setTempDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2 mt-1">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded text-[10px] hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setTempDesc(desc);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-300 text-black rounded text-[10px] hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </>
      ) : (
        <p className="text-[12px] text-[#646464] line-clamp-2 mb-2">{desc}</p>
      )}

      {/* Footer */}
      <div className={cn(
        'mt-2',
        isOwner ? 'w-[166px]' : 'w-[140px]'
      )}>
        <ForumCardFooter
          onViewDetails={handleViewDetails}
          onEdit={() => setIsEditing(true)}
          onDelete={() => setIsDeleteOpen(true)}
          isEditing={isEditing}
          tag={forum.tag}
          upvotes={upvotes}
          userVote={userVote === 'upvote'? userVote : null}
          handleVote={handleVote}
          isLoading={isLoading}
          isOwner={isOwner}
        />
      </div>

      {/* Hapus Dialog */}
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
