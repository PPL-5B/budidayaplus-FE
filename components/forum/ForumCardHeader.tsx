'use client';

import React from 'react';

interface ForumCardHeaderProps {
  title?: string;
  timestamp: Date;
  author?: string;
}

const ForumCardHeader: React.FC<ForumCardHeaderProps> = ({ title, timestamp, author }) => {
  const limitCharacters = (text: string, maxChars: number) => {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + '...';
  };

  return (
    <div className="mb-2">
      {/* Judul Forum */}
      <h2 className="text-[#2254C5] text-[20px] font-bold leading-[28px] font-sans">
        {limitCharacters(title ?? '(No Title)', 25)}
      </h2>

      {/* Tanggal dan Penulis */}
      <p className="text-[#404040] text-[10px] font-semi-bold leading-[18px]">
        Tanggal: {new Date(timestamp).toLocaleString()} {author ? `| Oleh ${author}` : ''}
      </p>
    </div>
  );
};

export default ForumCardHeader;
