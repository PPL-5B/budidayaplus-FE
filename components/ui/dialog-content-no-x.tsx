'use client'

import * as React from "react"
import * as DialogPrimitive from "@radix-ui/react-dialog"
import { cn } from "@/lib/utils"

const DialogContentNoX = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <DialogPrimitive.Portal>
    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/30" />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(
        "fixed left-1/2 top-1/2 z-50 max-w-[360px] w-full px-6 translate-x-[-50%] translate-y-[-50%] rounded-2xl bg-[#EAF0FF] py-8 shadow-none border-none flex flex-col items-start gap-6",
        className
      )}
      {...props}
    >
      <div className="w-full">
        {children}
      </div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>
))

DialogContentNoX.displayName = "DialogContentNoX"

export { DialogContentNoX }