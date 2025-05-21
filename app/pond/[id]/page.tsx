import { DeletePond, EditPond } from '@/components/pond';
import { PondQuality } from '@/components/pond-quality';
import { FoodSampling } from '@/components/food-sampling';
import FishDeathCard from '@/components/fish-death/FishDeathCard';
import { fetchPond } from '@/lib/pond';
import React from 'react'
import { FishSamplingCard } from '@/components/fish-sampling';
import { getLatestCycle } from '@/lib/cycle';
import { fetchPondQualityThreshold } from '@/lib/pond-quality';
import { getProfile } from '@/lib/profile';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const PondDetailPage = async ({ params }: { params: { id: string } }) => {
  // const fallbackSrc = 'fallbackimage.png'
  const pond = await fetchPond(params.id)
  const cycle = await getLatestCycle()
  const user = await getProfile()

  if (!pond) {
    return (
      <div className='min-h-[100vh] flex flex-col items-center justify-center'>
        Kolam tidak ditemukan
      </div>
    )
  }

  const thresholdData = cycle ? await fetchPondQualityThreshold(pond.pond_id, cycle.id) : null;
  const thresholdStatus = thresholdData?.status;

  return (
    <div className='min-h-[100vh] flex flex-col py-10 pb-20 mb-10 items-center'>
      <div className='w-[80%]'>
        <div className='flex flex-col space-y-2'>
          <div>
            <h1 className="text-2xl font-semibold text-neutral-800">Selamat datang di</h1>
            <h2 className="text-2xl font-bold text-[#2154C5]">{pond.name}</h2>
            {thresholdStatus && (
              <div className='mt-6'>
                <Popover>
                  <PopoverTrigger>
                    <div className='flex gap-3 items-center'>
                      <div className={cn('text-lg h-3 w-3 rounded-full', thresholdStatus === 'Sehat' ? 'bg-green-600' : thresholdStatus === 'Moderat' ? 'bg-yellow-600' : 'bg-red-600')} />
                      <p className={`text-lg ${thresholdStatus === 'Sehat' ? 'text-green-600' : thresholdStatus === 'Moderat' ? 'text-yellow-600' : 'text-red-600'}`}>
                        {thresholdStatus === 'Sehat' ? 'Sehat' : thresholdStatus === 'Moderat' ? 'Moderat' : 'Tidak Sehat'}
                      </p>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent>
                    <div>
                      <ul className='flex flex-col gap-y-2'>
                        {thresholdData.violations.length > 0 ? (
                          thresholdData.violations.map((item) => (
                            <li className='text-red-600' key={item}>- {item}</li>
                          ))
                        ) : (
                          <p className='text-sm text-green-600'>Selamat, kolam anda dalam kondisi sehat</p>
                        )}
                      </ul>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>
          <div>
            <div className='flex gap-x-2'>
              {user?.role === 'supervisor' && !cycle &&
                (
                  <>
                    <DeletePond pondId={pond.pond_id} />
                    <EditPond pond={pond} />
                  </>
                )
              }
            </div>
            <div className='relative mt-5'>
            </div>
          </div>
        </div>
        
        {/* Updated Pond Quality Section */}
        <div className='flex flex-col mt-2'>
          {cycle?.id && <PondQuality pondId={pond.pond_id} cycleId={cycle.id} />}
        </div>

        <div className='flex flex-col mt-7'>
          <FishSamplingCard pondId={pond.pond_id} cycleId={cycle?.id ?? ""} />
        </div>
        <div className='flex flex-col mt-7'>
          <FishDeathCard pondId={pond.pond_id} cycleId={cycle?.id ?? ""} />
        </div>
        <div className='flex flex-col mt-7'>
          <FoodSampling cycleId={cycle?.id ?? ""} pondId={pond.pond_id} />
        </div>
      </div>
    </div>
  )
}

export default PondDetailPage;