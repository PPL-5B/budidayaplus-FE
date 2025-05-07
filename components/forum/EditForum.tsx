'use client';

import { useState } from 'react';
import { updateForum } from '@/lib/forum/updateForum';

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
        setError(result.message || 'Gagal menyimpan perubahan');
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
      <input 
        type="text" 
        value={title}
        onChange={(e) => setTitle(e.target.value)} 
        placeholder="Judul forum"
        className="w-full p-2 border rounded text-sm"
        disabled={isLoading}
        required
      />
      <textarea 
        value={desc} 
        onChange={(e) => setDesc(e.target.value)} 
        placeholder="Deskripsi forum"
        className="w-full p-2 border rounded text-sm min-h-[80px]"
        disabled={isLoading}
        required
      />
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <div className="flex gap-2 justify-end">
        <button 
          onClick={onCancel}
          className="px-3 py-1 text-xs bg-gray-200 rounded hover:bg-gray-300"
          disabled={isLoading}
        >
          Batal
        </button>
        <button 
          onClick={handleSave}
          className="px-3 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
          disabled={isLoading}
        >
          {isLoading ? 'Menyimpan...' : 'Simpan'}
        </button>
      </div>
    </div>
  );
};

export default EditForumForm;