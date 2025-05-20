'use client';

import React from 'react';
import PondQualityDashboard from '@/components/pond-quality/PondQualityDashboard';
import PondQualityHistory from '@/components/pond-quality/PondQualityHistory';
import { getLatestCycle } from '@/lib/cycle';

const PondQualityHistoryPage = async ({ params }: { params: { id: string } }) => {
  const cycle = await getLatestCycle();

  return (
    <div className="py-10 pb-20 space-y-10">
      {/* Dasbor Kualitas Air Terbaru */}
      <PondQualityDashboard pondId={params.id} />

      {/* Riwayat Kualitas Air */}
      <PondQualityHistory pondId={params.id} />
    </div>
  );
};

export default PondQualityHistoryPage;
