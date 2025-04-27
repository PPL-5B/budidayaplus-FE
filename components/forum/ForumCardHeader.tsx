// components/forum/ForumCardHeader.tsx
import React from 'react';

interface ForumCardHeaderProps {
  description: string;
  timestamp: Date;
}

const ForumCardHeader: React.FC<ForumCardHeaderProps> = ({ description, timestamp }) => {
  return (
    <>
      <h2 className="text-[18px] font-bold text-black mb-1 line-clamp-1">
        {description.length > 60 ? description.slice(0, 60) + '...' : description}
      </h2>
      <h3 className="text-gray-600">
        Tanggal: {new Date(timestamp).toLocaleString()}
      </h3>
    </>
  );
};

export default ForumCardHeader;
