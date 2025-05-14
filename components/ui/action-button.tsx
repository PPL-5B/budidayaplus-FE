'use client';

import React from 'react';
import { cn } from '@/lib/utils';

interface ActionButtonProps {
  label: string;
  color?: 'red' | 'green' | 'blue' | 'gray';
  icon?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  size?: 'sm' | 'md';
}

const COLOR_MAP = {
  red: 'bg-[#C93939] hover:bg-[#a32f2f]',
  green: 'bg-[#298245] hover:bg-[#216a38]',
  blue: 'bg-[#2254C5] hover:bg-[#1e46a1]',
  gray: 'bg-gray-400 hover:bg-gray-500',
};

const SIZE_MAP = {
  sm: 'py-2 px-2 w-[80px] h-[25px] text-[10px]',
  md: 'w-[100px] h-[30px] text-[10px]',
};

const ActionButton: React.FC<ActionButtonProps> = ({
  label,
  color = 'gray',
  icon,
  onClick,
  disabled = false,
  className,
  size = 'sm',
}) => {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'flex items-center justify-center gap-1 rounded font-semibold text-white transition disabled:opacity-50 disabled:cursor-not-allowed',
        COLOR_MAP[color],
        SIZE_MAP[size],
        className
      )}
    >
      {icon && (
      <span className="flex items-center mr-1 -ml-1">
        {icon}
      </span>)}

      {label}
    </button>
  );
};

export default ActionButton;
