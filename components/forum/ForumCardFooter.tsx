// components/forum/ForumCardFooter.tsx
import React from 'react';

interface ForumCardFooterProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  userInitial: string;
  tag: string;
}

const ForumCardFooter: React.FC<ForumCardFooterProps> = ({
  onViewDetails,
  onEdit,
  onDelete,
  isEditing,
  userInitial,
  tag,
}) => {
  return (
    <>
      <div className="absolute bottom-2 left-3 flex items-center gap-2">
        {/* Tag */}
        <span className="text-[8px] bg-gray-200 px-2 py-[2px] rounded-full text-gray-600">
          {tag}
        </span>
        {/* Lihat Unggahan */}
        <button
          className="px-2 py-[2px] bg-[#2254C5] rounded-full text-white text-[8px] font-medium hover:brightness-110 transition"
          onClick={onViewDetails}
        >
          Lihat Unggahan
        </button>
      </div>

      {/* RIGHT BOTTOM: Edit dan Hapus Button */}
      {!isEditing && (
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

      {/* RIGHT TOP: User Initial */}
      <div className="absolute top-2 right-3 w-10 h-10 rounded-full bg-[#2254C5] flex items-center justify-center text-white text-[12px] font-bold">
        {userInitial}
      </div>
    </>
  );
};

export default ForumCardFooter;
