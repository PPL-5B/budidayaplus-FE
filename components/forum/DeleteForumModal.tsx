import React from "react";

interface DeleteForumModalProps {
  forumTitle: string;
  onDelete: () => void;
  onClose: () => void;
}

const DeleteForumModal: React.FC<DeleteForumModalProps> = ({
  forumTitle,
  onDelete,
  onClose,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Hapus Forum</h2>
        <p className="mb-6">Apakah kamu yakin ingin menghapus forum "{forumTitle}"?</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100"
          >
            Batal
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteForumModal;
