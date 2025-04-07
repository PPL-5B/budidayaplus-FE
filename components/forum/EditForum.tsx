'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateForum } from '@/lib/forum/updateForum';

interface EditForumFormProps {
  forumId: string;
}

export default function EditForumForm({ forumId }: EditForumFormProps) {
  const router = useRouter();
  const [desc, setDesc] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/forum/get_by_id/${forumId}`,
          { credentials: 'include' }
        );
        if (!res.ok) throw new Error("Gagal ambil data forum");
        const data = await res.json();
        setDesc(data.description || '');
      } catch (err) {
        console.error(err);
        alert('Gagal mengambil data forum');
      }
    };
    fetchData();
  }, [forumId]);

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append('description', desc);
    setLoading(true);

    const res = await updateForum(forumId, formData); // pakai server action
    setLoading(false);

    if (res.success) {
      alert('Forum berhasil diupdate');
      router.push('/forum?updated=true'); // trigger refresh
    } else {
      alert(res.message ?? 'Gagal update forum');
    }
  };

  return (
    <div className="space-y-4">
      <textarea
        className="w-full border p-2 rounded"
        rows={6}
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Edit deskripsi forum..."
      />
      <button
        onClick={handleSubmit}
        disabled={loading}
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
      >
        {loading ? 'Menyimpan...' : 'Simpan Perubahan'}
      </button>
    </div>
  );
}
