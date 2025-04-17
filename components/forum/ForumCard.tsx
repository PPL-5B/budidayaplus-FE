'use client';

import React, { useState } from 'react';
import { Forum } from '@/types/forum';
import { ChevronRight, ThumbsUp, ThumbsDown } from 'lucide-react';
import DeleteForumContainer from './DeleteForumContainer';
import { useVote } from '@/hooks/useVote';

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

  const {
    upvotes,
    downvotes,
    userVote,
    isLoading,
    isInitialized, // Ambil state ini
    handleUpvote,
    handleDownvote,
    handleCancelVote,
  } = useVote(forum.id);

  const handleSave = () => {
    setDesc(tempDesc);
    setIsEditing(false);
    onVoteSuccess?.({
      ...forum,
      description: tempDesc,
    });
  };

  const handleVote = async (voteType: 'upvote' | 'downvote') => {
    try {
      if (voteType === 'upvote') {
        if (userVote === 'upvote') {
          // Jika user sudah upvote, maka batalkan vote
          await handleCancelVote();
        } else {
          // Jika belum, lakukan upvote
          await handleUpvote();
        }
      }

      if (voteType === 'downvote') {
        if (userVote === 'downvote') {
          // Jika user sudah downvote, maka batalkan vote
          await handleCancelVote();
        } else {
          // Jika belum, lakukan downvote
          await handleDownvote();
        }
      }

      // Fetch ulang data setelah vote
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
    // Tampilkan placeholder atau skeleton loading jika data belum siap
    return <div className="w-full border rounded-lg p-4 shadow-md bg-white">Loading...</div>;
  }

  return (
    <div className="w-full border rounded-lg p-4 shadow-md bg-white hover:bg-gray-100 transition duration-200 flex flex-col gap-4">
      <h2 className="text-lg font-semibold">
        Dibuat oleh: {forum.user.first_name + ' ' + forum.user.last_name}
      </h2>
      <h3 className="text-gray-600">
        Tanggal: {new Date(forum.timestamp).toLocaleString()}
      </h3>

      {isEditing ? (
        <>
          <textarea
            className="w-full border p-2 rounded"
            rows={4}
            value={tempDesc}
            onChange={(e) => setTempDesc(e.target.value)}
          />
          <div className="flex justify-end gap-2">
            <button
              onClick={handleSave}
              className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Simpan
            </button>
            <button
              onClick={() => {
                setTempDesc(desc);
                setIsEditing(false);
              }}
              className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
            >
              Batal
            </button>
          </div>
        </>
      ) : (
        <>
          <p className="text-gray-600">{desc}</p>
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <button
                onClick={() => setIsEditing(true)}
                className="text-sm text-blue-500 font-medium hover:underline"
              >
                Edit deskripsi
              </button>

              <button
                onClick={() => setIsDeleteOpen(true)}
                className="text-sm text-red-500 font-medium hover:underline"
              >
                Hapus forum
              </button>
            </div>
            <button className="flex items-center text-sm text-blue-500 font-medium hover:underline">
              Lihat detail forum
              <ChevronRight className="w-5 h-5 ml-1 text-blue-500" />
            </button>
          </div>
        </>
      )}

      <div className="flex justify-between items-center mt-4">
        <div className="flex gap-4">
          {/* Tombol Upvote */}
          <button
            onClick={() => handleVote('upvote')}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-1 rounded ${
              userVote === 'upvote' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
            } hover:bg-green-200`}
          >
            <ThumbsUp
              className={`w-5 h-5 ${
                userVote === 'upvote' ? 'text-green-600' : 'text-gray-600'
              }`}
            />
            <span>{upvotes}</span>
          </button>

          {/* Tombol Downvote */}
          <button
            onClick={() => handleVote('downvote')}
            disabled={isLoading}
            className={`flex items-center gap-2 px-3 py-1 rounded ${
              userVote === 'downvote' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
            } hover:bg-red-200`}
          >
            <ThumbsDown
              className={`w-5 h-5 ${
                userVote === 'downvote' ? 'text-red-600' : 'text-gray-600'
              }`}
            />
            <span>{downvotes}</span>
          </button>
        </div>
      </div>

      <DeleteForumContainer
        forumId={forum.id}
        forumTitle={forum.description}
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