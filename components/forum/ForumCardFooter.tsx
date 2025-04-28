// components/forum/ForumCardFooter.tsx
import { ForumNavigation } from '@/lib/forum/forumNavigation';
import React from 'react';


interface ForumCardFooterProps {
  onViewDetails: () => void;
  onEdit: () => void;
  onDelete: () => void;
  isEditing: boolean;
  userInitial: string;
  isOwner: boolean;
}


const ForumCardFooter: React.FC<ForumCardFooterProps> = ({
  onViewDetails,
  onEdit,
  onDelete,
  isEditing,
  isOwner,
  userInitial
}) => {
  return (
    <>
      <div className="absolute bottom-2 left-3 flex items-center gap-2">
        <button
          className="px-2 py-[2px] bg-[#2254C5] rounded-full text-white text-[10px] font-medium hover:brightness-110 transition"
          onClick={() => ForumNavigation}
        >
          Lihat Unggahan
        </button>
      </div>


      {!isEditing && isOwner && (
        <div className="absolute bottom-2 right-3 flex gap-2">
          <button
            onClick={onEdit}
            className="text-[12px] text-blue-500 hover:underline"
          >
            Edit
          </button>
          <button
            onClick={onDelete}
            className="text-[12px] text-red-500 hover:underline"
          >
            Hapus
          </button>
        </div>
      )}


      <div className="absolute top-2 right-3 w-10 h-10 rounded-full bg-[#2254C5] flex items-center justify-center text-white text-[12px] font-bold">
        {userInitial}
      </div>
    </>
  );
};


export default ForumCardFooter;
