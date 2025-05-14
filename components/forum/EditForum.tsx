'use client';

import { useState } from 'react';
import { updateForum } from '@/lib/forum/updateForum';
import ActionButton from '../ui/action-button';

interface EditForumFormProps {
  forumId: string;
  initialTitle: string;
  initialDesc: string;
  onUpdateSuccess: (updatedDesc: string, updatedTitle: string) => void;
  onCancel: () => void;
}

const EditForumForm: React.FC<EditForumFormProps> = ({
  forumId,
  initialTitle,
  initialDesc,
  onUpdateSuccess,
  onCancel,
}) => {
  const [desc, setDesc] = useState(initialDesc);
  const [title, setTitle] = useState(initialTitle);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDesc, setIsEditingDesc] = useState(false);

  const handleSave = async () => {
    if (!desc.trim()) {
      setError('Deskripsi tidak boleh kosong');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await updateForum(
        forumId,
        title.trim(), 
        desc.trim()
      );

      if (result.success) {
        onUpdateSuccess(desc.trim(), title.trim());
      } else {
        setError(result.message ?? 'Gagal menyimpan perubahan');
      }
    } catch (err) {
      setError('Terjadi kesalahan saat menyimpan');
      console.error('Error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-2 mb-8">
  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      Ubah Judul
    </label>
    <input 
      type="text" 
      value={title}
      onChange={(e) => {
        setTitle(e.target.value);
        if (!isEditingTitle) setIsEditingTitle(true);
      }}
      placeholder="Judul forum"
      className="w-full p-2 border rounded text-sm"
      disabled={isLoading}
      required
    />
  </div>

  <div>
    <label className="block text-xs font-semibold text-gray-700 mb-1">
      Ubah Deskripsi
    </label>
    <textarea 
      value={desc} 
      onChange={(e) => {
        setDesc(e.target.value);
        if (!isEditingDesc) setIsEditingDesc(true);
      }}
      placeholder="Deskripsi forum"
      className="w-full p-2 border rounded text-sm min-h-[80px]"
      disabled={isLoading}
      required
    />
  </div>

  {error && <p className="text-red-500 text-sm">{error}</p>}

  <div className="flex gap-2 justify-end">
    <ActionButton
      label="Batal"
      color="gray"
      onClick={onCancel}
      disabled={isLoading}
      size="sm"
      className="bg-white border-2 border-[#2254C5] text-[#2254C5] hover:bg-[#2254C5] hover:text-white transition font-semibold"

    />
    <ActionButton
      label={isLoading ? "Menyimpan..." : "Simpan"}
      color="blue"
      onClick={handleSave}
      disabled={isLoading}
      size="sm"
    />
  </div>

</div>
  );
};

export default EditForumForm;