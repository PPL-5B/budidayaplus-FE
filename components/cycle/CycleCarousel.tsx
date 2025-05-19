'use client'

import { CycleList } from '@/types/cycle';
import React from 'react';
import {
  Carousel,
  CarouselContent,
} from "@/components/ui/carousel";
import { renderCycleCard } from '@/components/cycle';
import { cn } from '@/lib/utils';
import { Profile } from '@/types/profile';

interface CycleCarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  cycleList: CycleList;
  user?: Profile
}

const CycleCarousel: React.FC<CycleCarouselProps> = ({ cycleList, user }) => {
  return (
    <Carousel
      opts={{
        startIndex: 0
      }}
      className="max-w-full px-[10%]"
    >
    <CarouselContent className={cn('-ml-1')}>
      {cycleList.active.map((cycle) =>
        renderCycleCard(
          cycle,
          'Siklus Aktif',
          'bg-[#2154C5]',
          'text-primary-300',
          user
        )
      )}
      {cycleList.future.map((cycle) =>
        renderCycleCard(
          cycle,
          'Siklus Mendatang',
          'bg-slate-500',
          'text-slate-400'
        )
      )}
      {cycleList.past.map((cycle) =>
        renderCycleCard(
          cycle,
          'Siklus Lalu',
          'bg-slate-500',
          'text-slate-400'
        )
      )}
      {cycleList.stopped.map((cycle) =>
        renderCycleCard(
          cycle,
          'Siklus Dihentikan',
          'bg-slate-500',
          'text-slate-400'
        )
      )}
    </CarouselContent>

    </Carousel>
  );
};

export default CycleCarousel;
