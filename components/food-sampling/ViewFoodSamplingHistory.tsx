import React from 'react';
import { Button } from '@/components/ui/button';
import { History } from 'lucide-react';
import Link from 'next/link';

interface ViewFoodSamplingHistoryProps extends React.HTMLAttributes<HTMLDivElement> {
  pondId: string;
}

const ViewFoodSamplingHistory: React.FC<ViewFoodSamplingHistoryProps> = ({ pondId, ...props }) => {
  return (
    <div {...props} data-testid="view-pond-quality-history">
      <Button
        asChild
        variant="outline"
        size="sm"
        className="border-[#2154C5] text-[#2154C5] font-semibold hover:bg-[#F1F5FF] px-4 py-2"
      >
        <Link href={`/pond/${pondId}/food-sampling`} className="flex items-center gap-2">
          <History size={16} className="text-[#2154C5]" />
          Lihat Riwayat
        </Link>
      </Button>
    </div>
  );
};

export default ViewFoodSamplingHistory;
