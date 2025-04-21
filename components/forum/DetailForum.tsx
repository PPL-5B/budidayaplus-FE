'use client';

import React from 'react';

interface ForumDetailProps {
  forum: {
    id: number;
    description: string;
    timestamp: string;
    user: {
      first_name: string;
      last_name: string;
      email: string;
    };
  };
}

const DetailForum: React.FC<{ forum: ForumDetailProps['forum'] }> = ({ forum }) => {
  const tanggal = new Date(forum.timestamp).toLocaleDateString();
  const jam = new Date(forum.timestamp).toLocaleTimeString();

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-6">
      <h1 className="text-2xl font-bold mb-4">Detail Forum</h1>

      <p><span className="font-semibold">Username:</span> {forum.user.first_name}</p>
      <p><span className="font-semibold">Email:</span> {forum.user.last_name}</p>
      <p><span className="font-semibold">Tanggal Pembuatan:</span> {tanggal}</p>
      <p><span className="font-semibold">Jam Pembuatan:</span> {jam}</p>
      <p className="font-semibold mt-2">Deskripsi Forum:</p>
      <p className="border p-3 bg-gray-100 rounded">{forum.description}</p>
    </div>
  );
};

export default DetailForum;