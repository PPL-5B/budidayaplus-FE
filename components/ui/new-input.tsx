'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NewInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const NewInput = React.forwardRef<HTMLInputElement, NewInputProps>(({ className, ...props }, ref) => {
  return (
    <input
    className={cn(
        'flex h-10 w-full rounded-md border border-gray-300 bg-[#E6E6E5] px-3 py-2 text-sm placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-[#2254C5]',
        className
      )}
      
      ref={ref}
      {...props}
    />
  )
})
NewInput.displayName = 'NewInput'

export { NewInput }