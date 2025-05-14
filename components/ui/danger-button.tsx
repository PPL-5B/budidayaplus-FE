import React from "react";

interface DangerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DangerButton: React.FC<DangerButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="px-3 py-1.5 rounded-md bg-red-600 font-semibold text-white text-[14px] hover:bg-red-700 w-[30%]"
  >
    {children}
  </button>
);

export default DangerButton;