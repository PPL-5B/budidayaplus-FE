'use client';

import { Plus } from "lucide-react";
import React from "react";
import { Slot } from "@radix-ui/react-slot";

interface ButtonTambahkanDataProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const ButtonTambahkanData = React.forwardRef<HTMLButtonElement, ButtonTambahkanDataProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        {...props}
        className={`bg-[#2154C5] text-white font-semibold hover:bg-[#1941A9] px-2 py-2 rounded-md flex items-center gap-2 ${className}`}
      >
        <Plus size={16} />
        <span className="whitespace-nowrap">Tambahkan Data</span>
      </Comp>
    );
  }
);

ButtonTambahkanData.displayName = "ButtonTambahkanData";
export default ButtonTambahkanData;