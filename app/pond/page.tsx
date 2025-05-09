import { PondList, AddPond } from '@/components/pond';
import { getUser } from '@/lib/auth';
import { fetchPonds } from '@/lib/pond';
import { getLatestCycle } from '@/lib/cycle';
import { Pond } from '@/types/pond'
import React from 'react'

const PondListPage = async () => {
  const ponds: Pond[] = await fetchPonds();
  const user = await getUser();
  const cycle = await getLatestCycle();

  return (
    <div className='min-h-[100dvh] flex flex-col items-center py-10 mb-20'>
      <div className='w-[80%]'>
        <div className='flex flex-col space-y-10'>
          <div>
            <p className='text-3xl leading-7 font-light'>Selamat datang</p>
            <p className='text-3xl leading-7 font-semibold mt-2 text-[#2154C5]'>
              {user && `${user.first_name} ${user.last_name}`}
            </p>
          </div>
          {!cycle && <AddPond />}
          {ponds.length > 0 ?
            (
              <PondList ponds={ponds} />
            ) : (
              <p className='text-lg text-start'>Tidak ada kolam</p>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default PondListPage;
