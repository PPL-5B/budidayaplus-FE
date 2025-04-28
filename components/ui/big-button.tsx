'use client';

import React from 'react';

interface BigButtonProps {
  icon: React.ReactNode;
  text: string;
  onClick?: () => void;
}

const BigButton: React.FC<BigButtonProps> = ({ icon, text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 w-full bg-[#2254C5] text-white font-semibold rounded-xl py-4 px-6 hover:bg-[#1a47a0] transition-all justify-start"
    >
      {icon}
      <span>{text}</span>
    </button>
  );
};

export default BigButton;
