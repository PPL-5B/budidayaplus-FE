import React from 'react';

interface ForumTagProps {
  tag: string;
}

const tagStyles: Record<string, { bg: string; text: string; width: string }> = {
  kolam: {
    bg: '#FFD3D3',
    text: '#C93939',
    width: 'w-[60px]',
  },
  budidayaplus: {
    bg: '#FFE4BE',
    text: '#FF9500',
    width: 'w-[100px]',
  },
  siklus: {
    bg: '#CDFFD3',
    text: '#298245',
    width: 'w-[60px]',
  },
  ikan: {
    bg: '#C0FDFF',
    text: '#2254C5',
    width: 'w-[60px]',
  },
};

const ForumTag: React.FC<ForumTagProps> = ({ tag }) => {
  const lower = tag.toLowerCase();
  const style = tagStyles[lower] ?? {
    bg: '#E2E8F0',
    text: '#475569',
    width: 'w-[40px]',
  };

  return (
    <span
      className={`h-[20px] ${style.width} text-[10px] font-bold rounded-[5px] flex items-center justify-center`}
      style={{
        backgroundColor: style.bg,
        color: style.text,
      }}
    >
      {tag}
    </span>
  );
};

export default ForumTag;
