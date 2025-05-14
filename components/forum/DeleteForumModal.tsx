import React from "react";
import CancelButton from "../ui/cancel-button";
import DangerButton from "../ui/danger-button";

interface DeleteForumModalProps {
  onDelete: () => void;
  onClose: () => void;
  loading?: boolean;
  isDeleted?: boolean;
}

const DeleteForumModal: React.FC<DeleteForumModalProps> = ({
  onDelete,
  onClose,
  loading = false,
  isDeleted = false,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-[#EAF0FF] px-5 py-4 rounded-lg shadow-md w-full max-w-xs">
        <p className="text-[14px] text-center text-[#2254C5] font-bold mb-4">
          Apakah Anda yakin ingin menghapus forum?
        </p>

        {isDeleted && (
          <div className="text-center text-green-500 font-semibold mb-4 text-sm">
            Forum berhasil dihapus!
          </div>
        )}

        <div className="flex justify-center gap-3">
          <CancelButton onClick={onClose}>Batal</CancelButton>
          <DangerButton
            onClick={onDelete}
            disabled={loading}
            className="min-w-[90px]"
          >
            {loading ? "Menghapus..." : "Hapus"}
          </DangerButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteForumModal;
