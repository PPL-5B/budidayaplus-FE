import React from "react";

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CancelButton: React.FC<CancelButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="px-3 py-1.5 rounded-md border border-[#2254C5] text-[#2254C5] font-semibold text-[14px] hover:bg-[#2254C5] hover:text-white transition w-[30%]"
  >
    {children}
  </button>
);

export default CancelButton;