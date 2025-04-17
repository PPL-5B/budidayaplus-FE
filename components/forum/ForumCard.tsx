import React, { useState } from 'react';
import { useVote } from '@/hooks/useVote';
import { Forum } from '@/types/forum';

type ForumCardProps = {
  forum: Forum;
  onDeleteSuccess: (forumId: string) => void;
  onVoteSuccess: (forum: Forum) => void;
};

const ForumCard: React.FC<ForumCardProps> = ({ forum, onDeleteSuccess, onVoteSuccess }) => {
  const {
    upvotes,
    downvotes,
    userVote,
    isLoading,
    handleUpvote,
    handleDownvote,
    handleCancelVote
  } = useVote(forum);

  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState(forum.description);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSaveDescription = () => {
    setIsEditing(false);
    const updatedForum = { ...forum, description: editedDescription };
    onVoteSuccess(updatedForum);
  };

  const handleDeleteForum = () => {
    setIsDeleting(false);
    onDeleteSuccess(forum.id);
  };

  const handleUpvoteClick = async () => {
    try {
      if (userVote === 'upvote') {
        await handleCancelVote();
      } else {
        await handleUpvote();
        onVoteSuccess({ ...forum, upvotes, downvotes });
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  const handleDownvoteClick = async () => {
    try {
      if (userVote === 'downvote') {
        await handleCancelVote();
      } else {
        await handleDownvote();
        onVoteSuccess({ ...forum, upvotes, downvotes });
      }
    } catch (err) {
      console.error('Error voting:', err);
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="border p-4 rounded-lg shadow-md mb-4">
      <p className="font-semibold">Dibuat oleh: {forum.user.first_name} {forum.user.last_name}</p>

      {isEditing ? (
        <div>
          <textarea
            className="w-full border rounded p-2 mt-2"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            role="textbox"
          />
          <div className="mt-2 flex gap-2">
            <button onClick={handleSaveDescription} className="bg-blue-500 text-white px-3 py-1 rounded">
              Simpan
            </button>
            <button onClick={() => setIsEditing(false)} className="bg-gray-300 px-3 py-1 rounded">
              Batal
            </button>
          </div>
        </div>
      ) : (
        <p className="mt-2">{forum.description}</p>
      )}

      <div className="mt-4 flex gap-4 items-center">
        <button onClick={handleUpvoteClick} className="text-green-600">
          {upvotes}
        </button>
        <button onClick={handleDownvoteClick} className="text-red-600">
          {downvotes}
        </button>
        <button onClick={() => setIsEditing(true)} className="ml-auto text-blue-500 underline">
          Edit deskripsi
        </button>
      </div>

      <div className="mt-2">
        <button onClick={() => alert('Navigating to detail')} className="text-sm text-blue-600 underline">
          Lihat detail forum
        </button>
      </div>

      <div className="mt-2">
        <button onClick={() => setIsDeleting(true)} className="text-sm text-red-500 underline">
          Hapus forum
        </button>
        {isDeleting && (
          <div className="mt-2">
            <p>Yakin ingin menghapus?</p>
            <button onClick={handleDeleteForum} className="text-white bg-red-500 px-2 py-1 rounded mr-2">
              Hapus
            </button>
            <button onClick={() => setIsDeleting(false)} className="text-gray-600 underline">
              Batal
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForumCard;
