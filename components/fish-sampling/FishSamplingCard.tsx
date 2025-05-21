import React from 'react'
import { FishSamplingList, AddFishSampling } from '@/components/fish-sampling'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { History } from 'lucide-react'
import { fetchLatestFishSampling } from '@/lib/fish-sampling'

interface FishSamplingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string
  cycleId?: string
}

const FishSamplingCard: React.FC<FishSamplingCardProps> = async ({ pondId, cycleId, ...props }) => {
  const fishSampling = cycleId ? await fetchLatestFishSampling(pondId, cycleId) : undefined

  return (
    <div {...props}>
      <h1 className="text-[#2154C5] text-[22px] font-bold">Ukuran Ikan</h1>
      <div className="flex flex-col space-y-2">
        {cycleId && (
          <>
            {/* Row untuk tombol Sample & Riwayat */}
            <div className="flex gap-1 items-center mt-2">
              <AddFishSampling pondId={pondId} cycleId={cycleId} fishSampling={fishSampling} />
              <Button
                asChild
                variant="outline"
                size="sm"
                className="border-[#2154C5] text-[#2154C5] font-semibold hover:bg-[#F1F5FF] px-4 py-2"
              >
                <Link href={`/pond/${pondId}/fish-sampling`} className="flex items-center gap-2">
                  <History size={16} className="text-[#2154C5]" />
                  Lihat Riwayat
                </Link>
              </Button>
            </div>
          </>
        )}
        </div>
      <FishSamplingList className='mt-5' fishSampling={fishSampling}/>
    </div>
  )
}

export default FishSamplingCard
