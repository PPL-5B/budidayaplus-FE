import React from "react";

interface DangerButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const DangerButton: React.FC<DangerButtonProps> = ({ children, ...props }) => (
  <button
    {...props}
    className="px-4 py-2 rounded-md bg-red-600 text-white hover:bg-red-700"
  >
    {children}
  </button>
);

export default DangerButton;
