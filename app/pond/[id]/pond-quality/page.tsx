import PondQualityHistory from '@/components/pond-quality/PondQualityHistory';
import React from 'react';

const PondQualityHistoryPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className='py-10 pb-20'>
      <div>
        <PondQualityHistory pondId={params.id} />
      </div>
    </div>
  );
}

export default PondQualityHistoryPage;
