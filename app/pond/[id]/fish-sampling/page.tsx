import React from "react";
import FishSamplingDashboard from "@/components/fish-sampling/FishSamplingDashboard";
import FishSamplingHistory from "@/components/fish-sampling/FishSamplingHistory";

const FishSamplingHistoryPage = ({ params }: { params: { id: string } }) => {
  return (
    <div className="py-10 pb-20">
      <FishSamplingDashboard pondId={params.id} />
      <div className="mt-10">
        <FishSamplingHistory pondId={params.id} />
      </div>
    </div>
  );
};

export default FishSamplingHistoryPage;
