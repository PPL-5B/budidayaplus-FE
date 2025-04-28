import React from 'react';

interface ForumCardHeaderProps {
  title?: string;
  timestamp: Date;
}

const ForumCardHeader: React.FC<ForumCardHeaderProps> = ({ title, timestamp }) => {
  return (
    <>
      <h1 className="text-[14px] font-bold text-black mb-1 line-clamp-1">
        {title ?? '(No Title)'}
      </h1>
      <h3 className="text-gray-600 text-[10px]">
        Tanggal: {new Date(timestamp).toLocaleString()}
      </h3>
    </>
  );
};

export default ForumCardHeader;
