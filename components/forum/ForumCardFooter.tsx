'use client';

import React from 'react';
import { ThumbsUp, Trash2, Pencil } from 'lucide-react';
import ActionButton from '../ui/action-button';
import ForumTag from './ForumTag';

interface ForumCardFooterProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  tag: string;
  upvotes: number;
  userVote: 'upvote' | null;
  handleVote: (type: 'upvote') => void;
  isLoading: boolean;
  isOwner: boolean;
}

const ForumCardFooter: React.FC<ForumCardFooterProps> = ({
  onViewDetails,
  onEdit,
  onDelete,
  isEditing,
  tag,
  upvotes,
  userVote,
  handleVote,
  isLoading,
  isOwner,
}) => {
  return (
    <div className="flex flex-col gap-2 mt-3">
      <ForumTag tag={tag} />

      {/* Lihat Detail + Upvote */}
      <div className="flex items-center gap-3">
        <button
          className="text-blue-600 text-[12px] underline"
          onClick={onViewDetails}
        >
          Lihat Detail Forum
        </button>

        <button
          onClick={() => handleVote('upvote')}
          disabled={isLoading}
          className={`flex items-center gap-1 px-2 py-[2px] rounded-full text-[10px] transition ${
            userVote === 'upvote'
              ? 'bg-green-100 text-green-600'
              : 'bg-gray-100 text-gray-600 hover:bg-green-200 hover:text-green-600'
          }`}
        >
          <ThumbsUp className="w-3 h-3" />
          {upvotes}
        </button>
      </div>

      {/* Tombol Edit + Hapus (hanya untuk owner dan bukan saat editing) */}
      {!isEditing && isOwner && (
        <div className="flex gap-2">
          <ActionButton
            label="Hapus"
            color="red"
            icon={<Trash2 size={12} strokeWidth={2} />}
            onClick={onDelete}
          />
          <ActionButton
            label="Ubah"
            color="green"
            icon={<Pencil size={8} strokeWidth={2} />}
            onClick={onEdit}
          />
        </div>
      )}
    </div>
  );
};

export default ForumCardFooter;