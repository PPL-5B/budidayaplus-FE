"use client";

import React from "react";
import { useLatestFishSampling } from "@/hooks/useFishSampling";
import { Waves } from "lucide-react";

const targetValues = {
  fish_weight: 2.5, // kg
  fish_length: 40, // cm
};

const FishSamplingDashboard = ({ pondId }: { pondId: string }) => {
  const latestData = useLatestFishSampling(pondId);

  if (!latestData) return <p className="text-center text-gray-500">Loading data...</p>;

  return (
    <div className="mt-10">
      <h2 className="text-2xl font-semibold text-center flex items-center justify-center">
        <Waves className="w-10 h-10 text-[#2154C5] mr-2" /> Dashboard Sampling Ikan Terbaru
      </h2>
      <div className="flex justify-center mt-4">
      
        <table className="border-collapse border border-gray-300 w-[80%] text-center">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">Parameter</th>
              <th className="border border-gray-300 px-4 py-2">Nilai Aktual</th>
              <th className="border border-gray-300 px-4 py-2">Nilai Target</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-300 px-4 py-2 flex items-center justify-center">
                Berat Ikan (kg)
              </td>
              <td className="border border-gray-300 px-4 py-2">{latestData.fish_weight ?? "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{targetValues.fish_weight}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 px-4 py-2 flex items-center justify-center">
                Panjang Ikan (cm)
              </td>
              <td className="border border-gray-300 px-4 py-2">{latestData.fish_length ?? "N/A"}</td>
              <td className="border border-gray-300 px-4 py-2">{targetValues.fish_length}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FishSamplingDashboard;
