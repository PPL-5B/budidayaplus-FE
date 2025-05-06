'use client';

import React from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

interface ForumCardFooterProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  userInitial: string;
  tag: string;
  upvotes: number;
  downvotes: number;
  userVote: 'upvote' | 'downvote' | null;
  handleVote: (type: 'upvote' | 'downvote') => void;
  isLoading: boolean;
  isOwner: boolean;
}

const ForumCardFooter: React.FC<ForumCardFooterProps> = ({
  onViewDetails,
  onEdit,
  onDelete,
  isEditing,
  userInitial,
  tag,
  upvotes,
  downvotes,
  userVote,
  handleVote,
  isOwner,
  isLoading,
}) => {
  return (
    <>
      {/* LEFT SIDE: Tag, Lihat Unggahan, Vote */}
      <div className="absolute bottom-2 left-3 flex items-center gap-2">
        {/* Tag */}
        <span className="text-[8px] bg-gray-200 px-2 py-[2px] rounded-full text-gray-600 whitespace-nowrap">
          {tag}
        </span>

        {/* Lihat Unggahan */}
        <button
          className="px-2 py-[2px] bg-[#2254C5] rounded-full text-white text-[8px] font-medium hover:brightness-110 transition whitespace-nowrap"
          onClick={onViewDetails}
        >
          Lihat Unggahan
        </button>

        {/* Upvote */}
        <button
          onClick={() => handleVote('upvote')}
          disabled={isLoading}
          className={`flex items-center gap-1 px-2 py-[2px] rounded-full text-[8px] transition ${
            userVote === 'upvote'
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600 hover:bg-green-200 hover:text-green-600'
          }`}
        >
          <ThumbsUp
            className={`w-3 h-3 ${
              userVote === 'upvote'
                ? 'text-green-600'
                : 'text-gray-600 hover:text-green-600'
            }`}
          />
          {upvotes}
        </button>

        {/* Downvote */}
        <button
          onClick={() => handleVote('downvote')}
          disabled={isLoading}
          className={`flex items-center gap-1 px-2 py-[2px] rounded-full text-[8px] transition ${
            userVote === 'downvote'
              ? 'bg-red-100 text-red-600'
              : 'bg-gray-100 text-gray-600 hover:bg-red-200 hover:text-red-600'
          }`}
        >
          <ThumbsDown
            className={`w-3 h-3 ${
              userVote === 'downvote'
                ? 'text-red-600'
                : 'text-gray-600 hover:text-red-600'
            }`}
          />
          {downvotes}
        </button>
      </div>

      {/* RIGHT SIDE: Edit + Hapus */}
      {!isEditing && isOwner && (
        <div className="absolute bottom-2 right-3 flex gap-2">
          <button
            onClick={onEdit}
            className="text-[10px] text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-[10px] text-red-500 hover:underline"
          >
            Hapus
          </button>
        </div>
      )}

      {/* User Initial Bubble */}
      <div className="absolute top-2 right-3 w-10 h-10 rounded-full bg-[#2254C5] flex items-center justify-center text-white text-[12px] font-bold">
        {userInitial}
      </div>
    </>
  );
};

export default ForumCardFooter;