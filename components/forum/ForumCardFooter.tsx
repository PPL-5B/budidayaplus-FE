// components/forum/ForumCardFooter.tsx
import React from 'react';

interface ForumCardFooterProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  userInitial: string;
}

const ForumCardFooter: React.FC<ForumCardFooterProps> = ({
  onViewDetails,
  onEdit,
  onDelete,
  isEditing,
  userInitial
}) => {
  return (
    <div className="flex justify-between items-center mt-4">
      <div className="flex items-center gap-2">
        <button
          className="px-2 py-1 bg-[#2254C5] rounded-full text-white text-xs font-medium hover:brightness-110 transition"
          onClick={onViewDetails}
        >
          Lihat Unggahan
        </button>
        {!isEditing && (
          <div className="absolute bottom-3 right-3 flex gap-2">
            <button
              onClick={onEdit}
              className="text-xs font-medium text-blue-500 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={onDelete}
              className="text-xs font-medium text-red-500 hover:underline"
            >
              Hapus
            </button>
          </div>
        )}
      </div>

      <div className="absolute top-2 right-3 w-10 h-10 rounded-full bg-[#2254C5] flex items-center justify-center text-white text-[12px] font-bold">
        {userInitial}
      </div>
    </div>
  );
};

export default ForumCardFooter;
