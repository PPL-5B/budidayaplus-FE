'use client';

import React from "react";
import FishDeathDashboard from "@/components/fish-death/FishDeathDashboard";

const FishDeathHistoryPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="py-10 pb-20 space-y-10">
      {/* Dashboard Kematian Ikan */}
      <FishDeathDashboard pondId={params.id} />
    </div>
  );
};

export default FishDeathHistoryPage;