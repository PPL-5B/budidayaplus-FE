import React from 'react'
import { FishDeathList, AddFishDeath } from '@/components/fish-death'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { History } from 'lucide-react'
import { fetchLatestFishDeath } from '@/lib/fish-death'

interface FishDeathCardProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string
  cycleId?: string
}

const FishDeathCard: React.FC<FishDeathCardProps> = async ({ pondId, cycleId, ...props }) => {
  const fishDeath = cycleId ? await fetchLatestFishDeath(pondId, cycleId) : undefined

  return (
    <div {...props}>
      <h1 className="text-[#2154C5] text-[22px] font-bold">Kematian Ikan</h1>
      <div className="flex flex-col space-y-2">
        {cycleId && (
          <>
            {/* Row untuk tombol Sample & Riwayat */}
            <div className="flex gap-1 items-center mt-2">
              <AddFishDeath pondId={pondId} cycleId={cycleId} fishDeath={fishDeath} />
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#2154C5] text-[#2154C5] font-semibold hover:bg-[#F1F5FF] px-4 py-2"
              >
                <Link href={`/pond/${pondId}/fish-death`} className="flex items-center gap-2">
                  <History size={16} className="text-[#2154C5]" />
                  Lihat Riwayat
                </Link>
              </Button>
            </div>
          </>
        )}
        </div>
      <FishDeathList className='mt-5' fishDeath={fishDeath}/>
    </div>
  )
}

export default FishDeathCard