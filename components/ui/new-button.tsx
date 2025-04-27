'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'

export interface NewButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const NewButton = React.forwardRef<HTMLButtonElement, NewButtonProps>(({ className, ...props }, ref) => {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center rounded-md bg-[#2254C5] text-white font-semibold text-sm px-4 py-2 hover:bg-[#1e47a8] active:bg-[#1c4198]',
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
NewButton.displayName = 'NewButton'

export { NewButton }
