'use client'

import React from 'react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { History } from 'lucide-react'
import AddFishDeath from '@/components/fish-death/AddFishDeath'
import FishDeathList from '@/components/fish-death/FishDeathList'

interface FishDeathCardProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string
  cycleId?: string
}

const FishDeathCard: React.FC<FishDeathCardProps> = ({ pondId, cycleId, ...props }) => {
  return (
    <div {...props}>
      <p className="text-2xl font-medium"> Kematian Ikan </p>
      <div className="flex flex-col space-y-2">
        {cycleId && (
          <>
            <div className="flex items-center space-x-2">
              <AddFishDeath pondId={pondId} cycleId={cycleId} />
              <Button size="sm" variant="outline" asChild>
                <Link href={`/pond/${pondId}/fish-death`}>
                  Lihat Riwayat <History size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
            <FishDeathList className="mt-5" pondId={pondId} cycleId={cycleId} />
          </>
        )}
      </div>
    </div>
  )
}

export default FishDeathCard