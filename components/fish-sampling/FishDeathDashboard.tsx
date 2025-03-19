"use client";

import React from "react";
import { useCycle } from "@/hooks/useCycle";
import { FishSymbol } from "lucide-react";

interface FishDeathDashboardProps {
  pondId: string;
}

const FishDeathDashboard: React.FC<FishDeathDashboardProps> = ({ pondId }) => {
  const cycle = useCycle();

  if (!cycle) {
    return (
      <div className="border border-gray-200 p-3 rounded-md text-gray-500 text-center w-fit mx-auto">
        Data siklus belum tersedia, silakan buat siklus terlebih dahulu.
      </div>
    );
  }

  // Filter hanya satu kolam berdasarkan pondId
  const selectedPond = cycle.pond_fish_amount.find((pond) => pond.pond_id === pondId);

  if (!selectedPond) {
    return (
      <div className="border border-gray-200 p-3 rounded-md text-gray-500 text-center w-fit mx-auto">
        Kolam tidak ditemukan dalam siklus ini.
      </div>
    );
  }

  const deathRate = 0.1; 
  const fishDeathCount = Math.round(selectedPond.fish_amount * deathRate);
  const fishSurvived = Math.max(selectedPond.fish_amount - fishDeathCount, 0); // Pastikan tidak negatif

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
        <FishSymbol className="w-10 h-10 text-[#C52121] mr-2" /> Dashboard Kematian Ikan
      </h2>

      {/* Data Pond yang Dipilih */}
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
              <td className="border border-gray-300 px-4 py-2">{selectedPond.fish_amount} ekor</td>
              <td className="border border-gray-300 px-4 py-2 text-red-500">{fishDeathCount} ekor</td>
              <td className="border border-gray-300 px-4 py-2">{fishSurvived} ekor</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FishDeathDashboard;
