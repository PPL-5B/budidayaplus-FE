'use client'

import React from 'react'
import { DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface ModalProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string
  description?: string
  children?: React.ReactNode
}

export const Modal: React.FC<ModalProps> = ({ title, description, children, ...props }) => {  
  return (
    <DialogContent {...props}>
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
        <DialogDescription>
          {description}
        </DialogDescription>
      </DialogHeader>
      {children}
    </DialogContent>
  )
}