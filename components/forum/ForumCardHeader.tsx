'use client';

import React from 'react';

interface ForumCardHeaderProps {
  title?: string;
  timestamp: Date;
}

const ForumCardHeader: React.FC<ForumCardHeaderProps> = ({ title, timestamp }) => {
  const limitCharacters = (text: string, maxChars: number) => {
    if (text.length <= maxChars) return text;
    return text.slice(0, maxChars) + '...';
  };

  return (
    <>
      <div className="flex justify-between items-center mb-1">
        <h1 className="text-[14px] font-bold text-black line-clamp-1">
          {limitCharacters(title ?? '(No Title)', 10)}
        </h1>
      </div>
      <h3 className="text-gray-600 text-[10px]">
        Tanggal: {new Date(timestamp).toLocaleString()}
      </h3>
    </>
  );
};

export default ForumCardHeader;