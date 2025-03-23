import React from 'react'
import { FishSamplingList, AddFishSampling } from '@/components/fish-sampling'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { History } from 'lucide-react'
import { fetchLatestFishSampling } from '@/lib/fish-sampling'
import AddFishDeath from '@/components/fish-sampling/AddFishDeath';


interface FishSamplingCardProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string
  cycleId?: string
}


const FishSamplingCard: React.FC<FishSamplingCardProps> = async ({ pondId, cycleId, ...props }) => {
  const fishSampling = cycleId ? await fetchLatestFishSampling(pondId, cycleId) : undefined


  return (
    <div {...props}>
      <p className='text-2xl font-medium'> Sampling Ikan </p>
      <div className="flex flex-col space-y-2">
        {cycleId && (
          <>
            {/* Row untuk tombol Sample & Riwayat */}
            <div className="flex items-center space-x-2">
              <AddFishSampling pondId={pondId} cycleId={cycleId} fishSampling={fishSampling} />
              <Button size="sm" variant="outline" asChild>
                <Link href={`/pond/${pondId}/fish-sampling`}>
                  Lihat Riwayat <History size={16} className="ml-2" />
                </Link>
              </Button>
            </div>


            {/* Tombol Kematian Ikan berada di bawah */}
            <AddFishDeath pondId={pondId} cycleId={cycleId} />
          </>
        )}
        </div>
      {cycleId && (
        <FishSamplingList className='mt-5' fishSampling={fishSampling} pondId={pondId} cycleId={cycleId} />
      )}
    </div>
  )
}


export default FishSamplingCard



