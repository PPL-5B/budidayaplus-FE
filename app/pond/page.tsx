import { PondList, AddPond } from '@/components/pond';
import { getUser } from '@/lib/auth';
import { fetchPonds } from '@/lib/pond';
import { getLatestCycle } from '@/lib/cycle';
import { Pond } from '@/types/pond'
import React from 'react'

const PondListPage = async () => {
  const ponds: Pond[] = await fetchPonds();
  const cycle = await getLatestCycle();

  return (
    <div className='min-h-screen flex flex-col bg-[#EAF0FF]'>
      <div className='flex-1 flex flex-col items-center pt-4 pb-20'> 
        <div className='w-[80%]'>
          <div className='flex flex-col space-y-10'>
            <div>
              <p className='text-3xl text-center leading-7 font-semibold text-[#2154C5]'>
                Daftar Kolam
              </p>
            </div>
            {!cycle && <AddPond />}
            {ponds.length > 0 ? (
              <PondList ponds={ponds} />
            ) : (
              <p className='text-lg text-start'>Tidak ada kolam</p>
            )
          }
        </div>
      </div>
    </div>
  </div>
  );
};
export default PondListPage;
