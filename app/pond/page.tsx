import { PondList, AddPond } from '@/components/pond';
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
            <div className="flex justify-center mt-1">
              <h1 className="text-[#2154C5] text-[30px] font-bold">Daftar Kolam</h1>
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
