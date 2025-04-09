import React from "react";

interface CancelButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const CancelButton: React.FC<CancelButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 rounded-md border border-gray-400 text-gray-600 hover:bg-gray-100"
  >
    {children}
  </button>
);

export default CancelButton;
