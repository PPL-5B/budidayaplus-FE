import React from 'react';
import Link from 'next/link';
import ButtonLihatRiwayat from '@/components/ui/ButtonLihatRiwayat';

interface ViewPondQualityHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
}

const ViewPondQualityHistory: React.FC<ViewPondQualityHistoryProps> = ({ pondId, ...props }) => {
  return (
    <div {...props} className="inline-flex" data-testid='view-pond-quality-history'>
      <Link href={`/pond/${pondId}/pond-quality`}>
        <ButtonLihatRiwayat />
      </Link>
    </div>
  );
};

export default ViewPondQualityHistory;