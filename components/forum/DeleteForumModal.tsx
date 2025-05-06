import React from "react";
import CancelButton from "../ui/cancel-button";
import DangerButton from "../ui/danger-button";

interface DeleteForumModalProps {
  onDelete: () => void;
  onClose: () => void;
  loading?: boolean;
  isDeleted?: boolean; // Menambahkan prop untuk status forum terhapus  
}

const DeleteForumModal: React.FC<DeleteForumModalProps> = ({
  onDelete,
  onClose,
  loading = false,
  isDeleted = false, // Menambahkan prop untuk status forum terhapus
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-md w-96">
        <h2 className="text-xl font-semibold text-center mb-4">Hapus Forum</h2>
        <p className="mb-6 text-center">
          Apakah Anda yakin ingin menghapus forum?
        </p>

          {/* Jika forum berhasil dihapus, tampilkan notifikasi */}
        {isDeleted && (
          <div className="text-center text-green-500 font-semibold mb-4">
            Forum berhasil dihapus!
          </div>
        )}
        <div className="flex gap-3 justify-center">
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
