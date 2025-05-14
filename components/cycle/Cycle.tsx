import React from "react";
import { AddCycle, CycleList } from "@/components/cycle";
import { getProfile } from "@/lib/profile";

const Cycle = async () => {
  const user = await getProfile();

  return (
    <div className="flex flex-col items-center w-full mt-10">
      {/* 
        This container holds both the Memulai Siklus button 
        and the Check our Forum button side by side.
      */}
      <div className="flex w-[80%] justify-start gap-4">
        {/* "Memulai Siklus" button (AddCycle) */}
        <AddCycle user={user} className="flex" />
      </div>

      {/* Your cycle list below */}
      <CycleList user={user} className="w-full mt-5" />
    </div>
  );
};

export default Cycle;
