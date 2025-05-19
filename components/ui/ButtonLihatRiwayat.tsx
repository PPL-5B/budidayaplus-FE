'use client';

import React from "react";
import { History } from 'lucide-react';
import { Slot } from "@radix-ui/react-slot";

interface ButtonLihatRiwayatProps extends React.HTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

const ButtonLihatRiwayat = React.forwardRef<HTMLButtonElement, ButtonLihatRiwayatProps>(
  ({ className, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        {...props}
        className={`border border-[#2154C5] text-[#2154C5] font-semibold hover:bg-[#F1F5FF] px-4 py-1.5 rounded-md flex items-center gap-2 ${className}`}
      >
        <History size={16} className="text-[#2154C5]" />
        <span className="whitespace-nowrap">Lihat Riwayat</span>
      </Comp>
    );
  }
);

ButtonLihatRiwayat.displayName = "ButtonLihatRiwayat";
export default ButtonLihatRiwayat;