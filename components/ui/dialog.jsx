"use client"

import * as DialogPrimitive from "@radix-ui/react-dialog"

// Core exports
export const Dialog = DialogPrimitive.Root
export const DialogTrigger = DialogPrimitive.Trigger
export const DialogContent = DialogPrimitive.Content
export const DialogClose = DialogPrimitive.Close

// Additional components if needed
export const DialogHeader = ({ children }) => (
  <div className="flex flex-col space-y-2 text-center sm:text-left">
    {children}
  </div>
)

export const DialogTitle = DialogPrimitive.Title
export const DialogDescription = DialogPrimitive.Description

export const DialogFooter = ({ children }) => (
  <div className="flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
    {children}
  </div>
)
