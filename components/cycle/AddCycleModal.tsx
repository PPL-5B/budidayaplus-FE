'use client'

import React, { useState } from 'react'
import { AddCycleForm } from '@/components/cycle'
import { Button } from '@/components/ui/button'
import { Pond } from '@/types/pond';
import { RefreshCcw } from 'lucide-react';
import { EmptyPool } from '../ui/empty-pool';

interface AddCycleModalProps extends React.HTMLAttributes<HTMLDivElement> {
  pondList: Pond[]
}

const AddCycleModal: React.FC<AddCycleModalProps> = ({ pondList, ...props }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <div {...props}>
      {pondList.length === 0 ? (
        <EmptyPool />
      ) : (
        <>
          <Button
            className='bg-[#ff8585] hover:bg-[#ff8585] text-white rounded-xl'
            onClick={() => setIsModalOpen(true)}
          >
            Mulai Siklus <RefreshCcw className='ml-2 h-5 w-5' />
          </Button>

          {isModalOpen && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/30">
              <div className="relative">
                <AddCycleForm pondList={pondList} setIsModalOpen={setIsModalOpen} />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default AddCycleModal
