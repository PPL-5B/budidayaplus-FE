'use client';

import React, { useState } from 'react';
import { deletePond } from '@/lib/pond';
import { Pond } from '@/types/pond';
import { Trash2 } from 'lucide-react';
import CancelButton from '@/components/ui/cancel-button';
import DangerButton from '@/components/ui/danger-button';

type DeletePondProps = {
  pondId: Pond['pond_id'];
};

const DeletePond: React.FC<DeletePondProps> = ({ pondId }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDeleted, setIsDeleted] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    setError(null);
    try {
      const isDeleteSuccess = await deletePond(pondId);
      if (isDeleteSuccess) {
        setIsDeleted(true);
        setTimeout(() => {
          window.location.href = '/pond';
        }, 1000);
      } else {
        setError('Gagal menghapus kolam');
      }
    } catch (error) {
      setError('Gagal menghapus kolam');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
      onClick={() => setShowConfirm(true)}
      className="flex items-center gap-2 rounded-xl bg-red-600 hover:bg-red-700 text-white px-4 py-2 font-semibold text-sm whitespace-nowrap"
      >
      <Trash2 size={12} strokeWidth={3} />
      Hapus Kolam
      </button>

      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
          <div className="bg-[#EAF0FF] px-5 py-4 rounded-lg shadow-md w-full max-w-xs">
            <p className="text-[14px] text-center text-[#2254C5] font-bold mb-4">
              Apakah Anda yakin ingin menghapus kolam?
            </p>

            {isDeleted && (
              <div className="text-center text-green-500 font-semibold mb-4 text-sm">
                Kolam berhasil dihapus!
              </div>
            )}

            {error && (
              <div className="text-center text-red-500 font-semibold mb-4 text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-center gap-3">
              <CancelButton onClick={() => setShowConfirm(false)}>Batal</CancelButton>
              <DangerButton
                onClick={handleDelete}
                disabled={loading}
                className="min-w-[90px]"
              >
                {loading ? 'Menghapus...' : 'Hapus'}
              </DangerButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeletePond;
