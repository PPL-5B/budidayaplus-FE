"use client";

import React from "react";
import { ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCycle } from "@/hooks/useCycle";
import { useLatestFishDeath } from "@/hooks/useFishDeath";
import { LoadingData } from "@/components/ui/loading-data";
import { EmptyData } from "@/components/ui/empty-data";

interface FishDeathDashboardProps {
  pondId: string;
}

const FishDeathDashboard: React.FC<FishDeathDashboardProps> = ({ pondId }) => {
  const router = useRouter();
  const cycle = useCycle();
  const fishDeathData = useLatestFishDeath(pondId);

  const isLoading = fishDeathData === undefined;

  if (!cycle) {
    return (
      <div className="w-full flex flex-col items-center bg-[#EDF2FF] pt-6">
        <div className="w-[90%] max-w-2xl">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#2154C5] mb-4 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-[#2154C5] font-bold text-base">Kembali</span>
          </button>
          <EmptyData title="Data siklus belum tersedia, silakan buat siklus terlebih dahulu." />
        </div>
      </div>
    );
  }

  const selectedPond = cycle.pond_fish_amount.find((pond) => pond.pond_id === pondId);

  if (!selectedPond) {
    return (
      <div className="w-full flex flex-col items-center bg-[#EDF2FF] pt-6">
        <div className="w-[90%] max-w-2xl">
          <button
            onClick={() => router.back()}
            className="flex items-center text-[#2154C5] mb-4 focus:outline-none"
          >
            <ChevronLeft className="w-5 h-5 mr-1" />
            <span className="text-[#2154C5] font-bold text-base">Kembali</span>
          </button>
          <EmptyData title="Kolam tidak ditemukan dalam siklus ini." />
        </div>
      </div>
    );
  }

  const fishSeeded = selectedPond.fish_amount ?? 0;

  return (
    <div className="w-full flex flex-col items-center bg-[#EDF2FF] pt-6">
      <div className="w-[90%] max-w-2xl">
        {/* Tombol kembali */}
        <button
          onClick={() => router.back()}
          className="flex items-center text-[#2154C5] mb-4 focus:outline-none"
        >
          <ChevronLeft className="w-5 h-5 mr-1" />
          <span className="text-[#2154C5] font-bold text-base">Kembali</span>
        </button>

        {/* Judul */}
        <h2 className="text-lg font-bold text-black mb-4">Dasbor Kematian Ikan Terbaru</h2>

        {/* Konten utama */}
        {(() => {
          if (isLoading) {
            return <LoadingData />;
          }

          if (fishDeathData) {
            const fishDead = fishDeathData.fish_death_count;
            const fishAlive = fishDeathData.fish_alive_count;

            return (
              <div className="overflow-hidden rounded-xl border border-[#2154C5] bg-[#EDF2FF]">
                <table className="w-full text-center">
                  <thead className="bg-[#2154C5] text-white text-sm">
                    <tr>
                      <th className="py-3 px-4 font-semibold">Parameter</th>
                      <th className="py-3 px-4 font-semibold">Nilai</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm text-gray-800 font-medium">
                    <tr>
                      <td className="py-4 px-4">Bibit Ditebar</td>
                      <td className="py-4 px-4">{fishSeeded} ekor</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">Ikan Mati</td>
                      <td className="py-4 px-4 text-red-500">{fishDead} ekor</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-4">Ikan Bertahan</td>
                      <td className="py-4 px-4">{fishAlive} ekor</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            );
          }

          return (
            <div className="mt-6">
              <EmptyData/>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

export default FishDeathDashboard;