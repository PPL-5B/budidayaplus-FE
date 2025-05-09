'use client'

import { Pond } from '@/types/pond'
import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Info } from 'lucide-react'

interface PondCardProps {
  pond: Pond
}

const PondCard: React.FC<PondCardProps> = ({ pond }) => {
  const volume = pond.depth * pond.width * pond.length

  return (
    <div>
      <Card className="bg-[#EAF0FF] border border-[#ccc] rounded-lg">
        <CardHeader className="pb-2">
          <CardTitle className="text-blue-700 text-lg font-bold">
            Kolam {pond.name.toUpperCase()}
          </CardTitle>
        </CardHeader>
        <CardContent className="pb-2">
          <p className="text-sm font-semibold text-gray-700">
            Volume Kolam: {volume.toFixed(0)} m<sup>3</sup>
          </p>
        </CardContent>
        <CardFooter>
          <Link href={`/pond/${pond.pond_id}`}>
          <Button
            variant="outline"
            className="group bg-[#EAF0FF] border-2 border-blue-700 text-blue-700 text-sm font-semibold rounded-m hover:bg-blue-700 flex items-center px-3 py-1 space-x-2"
          >
            <Info className="w-4 h-4 group-hover:text-white text-blue-700" />
            <span className="group-hover:text-white">Lihat Detail Kolam</span>
          </Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}

export default PondCard
