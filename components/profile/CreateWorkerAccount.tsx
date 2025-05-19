'use client'

import React, { useState } from 'react'
import { ReusableRegisterForm } from '@/components/profile'
import { IoIosAdd } from 'react-icons/io'
import { RegisterForm } from '@/types/auth/register'
import { createWorker } from '@/lib/profile'
import {
  Dialog,
  DialogContent,
  DialogTrigger
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

interface CreateWorkerAccountProps extends React.HTMLAttributes<HTMLDivElement> {
  onSuccess?: () => void
}

const CreateWorkerAccount: React.FC<CreateWorkerAccountProps> = ({ onSuccess, ...props }) => {
  const [open, setOpen] = useState(false)

  const onSubmit = async (
    data: RegisterForm,
    reset: () => void,
    setError: React.Dispatch<React.SetStateAction<string | null>>
  ) => {
    const result = await createWorker(data)
    if (result.data) {
      setOpen(false)
      reset()
      onSuccess?.()
    } else {
      setError(result.error)
    }
  }

  return (
    <div {...props} data-testid="create-worker-container">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            data-testid="open-dialog-button"
            size="sm"
            className="flex items-center gap-2 bg-[#2154C5] hover:bg-[#1A3F96] text-white font-semibold rounded-md px-4 py-2"
          >
            <IoIosAdd size={16} data-testid="add-icon" />
            Daftarkan Pekerja
          </Button>
        </DialogTrigger>

        <DialogContent
          data-testid="dialog-content"
          className="w-[350px] max-w-xl p-0 bg-transparent shadow-none [&>button]:hidden"
        >
          <ReusableRegisterForm
            data-testid="register-form"
            onSubmit={onSubmit}
            setIsFormOpen={setOpen}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateWorkerAccount
