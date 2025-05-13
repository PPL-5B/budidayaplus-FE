'use client'

import React from 'react'
import { DialogContent } from '@/components/ui/dialog'

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string
  description?: string
  children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ children, ...props }) => {  
  return (
    <DialogContent 
      {...props}
      className="w-[95vw] max-w-[350px] p-0 bg-transparent border-none shadow-none ml-10 sm:ml-0"
    >
      {children}
    </DialogContent>
  )
}