'use client'

import React from 'react'
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Modal as DialogContent } from '@/components/ui/modal'
import { stopCycle } from '@/lib/cycle'
import { Ban } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'

interface StopCycleButtonProps extends React.HTMLAttributes<HTMLDivElement> {
  cycleId: string
}

const StopCycle: React.FC<StopCycleButtonProps> = ({ cycleId, ...props }) => {
  const [modalOpen, setModalOpen] = React.useState(false)
  const [loading, setLoading] = React.useState(false)
  const { toast } = useToast()

  const handleStop = async () => {
    try {
      setLoading(true)
      const res = await stopCycle(cycleId)
      if (res.success) {
        toast({
          description: 'Siklus berhasil dihentikan',
          variant: 'success'
        })
      } else {
        toast({
          title: 'Gagal menghentikan siklus',
          description: 'Silakan coba lagi.',
          variant: 'destructive'
        })
      }
    } catch {
      toast({
        title: 'Gagal menghentikan siklus',
        description: 'Silakan coba lagi.',
        variant: 'destructive'
      })
    } finally {
      setModalOpen(false)
      setLoading(false)
    }
  }

  return (
    <div {...props}>
      <Dialog modal open={modalOpen} onOpenChange={setModalOpen}>
        <DialogTrigger asChild>
          <Button className='rounded-full' size='sm' variant={'destructive'}>
            Stop Siklus <Ban className='ml-2' size={18} />
          </Button>
        </DialogTrigger>
        <DialogContent
          title='' 
          className="bg-[#EAF0FF] p-4 rounded-xl max-w-xs w-full shadow-none text-center space-y-4"
        >
          <h2 className="text-[#2254C5] font-semibold text-sm">
            Apa Anda yakin ingin stop siklus?
          </h2>
          <div className="flex justify-center gap-3">
            <Button
              variant="outline"
              className="border-[#2254C5] text-[#2254C5] px-4 py-1 text-sm"
              onClick={() => setModalOpen(false)}
              disabled={loading}
            >
              Tidak
            </Button>
            <Button
              className="bg-[#2254C5] hover:bg-[#1e45a8] text-white px-4 py-1 text-sm"
              onClick={handleStop}
              disabled={loading}
            >
              Iya
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default StopCycle