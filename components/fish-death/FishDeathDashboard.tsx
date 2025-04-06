"use client";

import React, { useEffect, useState } from "react";
import { useCycle } from "@/hooks/useCycle";
import { FishSymbol } from "lucide-react";
import { fetchLatestFishDeath } from "@/lib/fish-death/fetchFishDeath";
import { FishDeath } from "@/types/fish-death";

interface FishDeathDashboardProps {
  pondId: string;
}

const FishDeathDashboard: React.FC<FishDeathDashboardProps> = ({ pondId }) => {
  const cycle = useCycle();
  const [fishDeathData, setFishDeathData] = useState<FishDeath | null>(null);

  useEffect(() => {
    const getData = async () => {
      if (!cycle) return;
      const data = await fetchLatestFishDeath(pondId, cycle.id);
      setFishDeathData(data ?? null);
    };

    getData();
  }, [pondId, cycle]);

  if (!cycle) {
    return (
      <div className="border border-gray-200 p-3 rounded-md text-gray-500 text-center w-fit mx-auto">
        Data siklus belum tersedia, silakan buat siklus terlebih dahulu.
      </div>
    );
  }

  const selectedPond = cycle.pond_fish_amount.find((pond) => pond.pond_id === pondId);

  if (!selectedPond) {
    return (
      <div className="border border-gray-200 p-3 rounded-md text-gray-500 text-center w-fit mx-auto">
        Kolam tidak ditemukan dalam siklus ini.
      </div>
    );
  }

  const fishSeeded = selectedPond.fish_amount ?? 0;

  if (!fishDeathData) {
    return (
      <div className="border border-gray-200 p-3 rounded-md text-gray-500 text-center w-fit mx-auto">
        Data belum tersedia, silakan isi data terlebih dahulu.
      </div>
    );
  }

  const fishDead = fishDeathData.fish_death_count;
  const fishAlive = fishDeathData.fish_alive_count;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
        <FishSymbol className="w-10 h-10 text-[#2154C5] mr-2" /> Dashboard Kematian Ikan
      </h2>

      <div className="flex justify-center mt-4">
        <table className="border-collapse border border-gray-300 w-[80%] text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Bibit Ditebar</th>
              <th className="border border-gray-300 px-4 py-2">Ikan Mati</th>
              <th className="border border-gray-300 px-4 py-2">Ikan Bertahan</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2">{fishSeeded} ekor</td>
              <td className="border border-gray-300 px-4 py-2 text-red-500">{fishDead} ekor</td>
              <td className="border border-gray-300 px-4 py-2">{fishAlive} ekor</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FishDeathDashboard;
