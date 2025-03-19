import React from "react";
import FishDeathDashboard from "@/components/fish-sampling/FishDeathDashboard"; 
import FishSamplingDashboard from "@/components/fish-sampling/FishSamplingDashboard";
import FishSamplingHistory from "@/components/fish-sampling/FishSamplingHistory";

const FishSamplingHistoryPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="py-10 pb-20">
      {/* Dashboard Kematian Ikan */}
      <FishDeathDashboard pondId={params.id} />
      
      {/* Dashboard Sampling Ikan */}
      <FishSamplingDashboard pondId={params.id} />
      
      {/* Riwayat Sampling Ikan */}
      <div className="mt-10">
        <FishSamplingHistory pondId={params.id} />
      </div>
    </div>
  );
};

export default FishSamplingHistoryPage;
