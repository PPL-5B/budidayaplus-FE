import React from "react";
import CancelButton from "../ui/cancel-button";
import DangerButton from "../ui/danger-button";

interface DeleteForumModalProps {
  forumTitle: string;
  onDelete: () => void;
  onClose: () => void;
  loading?: boolean;
}

const DeleteForumModal: React.FC<DeleteForumModalProps> = ({
  forumTitle,
  onDelete,
  onClose,
  loading = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4">Hapus Forum</h2>
        <p className="mb-6">
          Apakah kamu yakin ingin menghapus forum '{forumTitle}'?
        </p>
        <div className="flex justify-end gap-3">
          <CancelButton onClick={onClose}>Batal</CancelButton>
          <DangerButton
            onClick={onDelete}
            disabled={loading}
            className="min-w-[100px]"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </DangerButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteForumModal;
