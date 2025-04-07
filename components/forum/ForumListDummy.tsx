"use client";

import { useState } from "react";

interface Forum {
  id: number;
  title: string;
  created_at: string;
}

const dummyForums: Forum[] = [
  { id: 1, title: "Cara Budidaya Lele", created_at: "2024-12-01" },
  { id: 2, title: "Masalah Air Kolam", created_at: "2024-12-05" },
  { id: 3, title: "Pakan yang Efisien", created_at: "2025-01-10" },
];

export default function ForumListDummy() {
  const [forums, setForums] = useState<Forum[]>(dummyForums);
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleDelete = (id: number) => {
    setForums(prev => prev.filter(f => f.id !== id));
    setSelectedId(null);
  };

  return (
    <div className="space-y-4 mt-6">
      {forums.map((forum) => (
        <div key={forum.id} className="flex justify-between items-center border p-4 rounded-md">
          <div>
            <p className="text-lg font-semibold">{forum.title}</p>
            <p className="text-sm text-gray-500">{forum.created_at}</p>
          </div>
          <button
            onClick={() => setSelectedId(forum.id)}
            className="text-red-600 hover:underline"
          >
            Hapus
          </button>
        </div>
      ))}

      {selectedId && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <p className="text-lg">Yakin ingin menghapus forum ini?</p>
            <div className="flex gap-4 mt-4">
              <button
                onClick={() => handleDelete(selectedId)}
                className="px-4 py-2 bg-red-600 text-white rounded-md"
              >
                Hapus
              </button>
              <button
                onClick={() => setSelectedId(null)}
                className="px-4 py-2 bg-gray-200 rounded-md"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
