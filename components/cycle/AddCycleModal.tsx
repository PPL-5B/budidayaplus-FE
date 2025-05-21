'use client'

import React, { useState } from 'react'
import { AddCycleForm } from '@/components/cycle'
import { Dialog, DialogTrigger } from '@/components/ui/dialog'
import { Modal as DialogContent } from '@/components/ui/modal'
import { Pond } from '@/types/pond'
import { RefreshCcw } from 'lucide-react'
import ActionButton from '../ui/action-button'

interface AddCycleModalProps extends React.HTMLAttributes<HTMLDivElement> {
  pondList: Pond[]
}

const AddCycleModal: React.FC<AddCycleModalProps> = ({ pondList, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div {...props}>
      {pondList.length === 0 ? (
        <p className='text-center text-gray-500'>Tidak ada kolam yang tersedia</p>
      ) : (
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} modal={false}>
          <DialogTrigger asChild>
            <ActionButton
              label="Mulai Siklus"
              icon={<RefreshCcw className="w-4 h-4" />}
              size="md"
              className="bg-[#2254C5] hover:bg-[#2254C5] text-white text-[12px] font-semibold transition"
            />
          </DialogTrigger>
            <DialogContent
              title="Mulai Siklus"
              className="bg-[#EDF2FF]"
            >
            <AddCycleForm pondList={pondList} setIsModalOpen={setIsModalOpen} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default AddCycleModal
