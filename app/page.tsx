// app/page.tsx
import React from "react";
import Cycle from "@/components/cycle/Cycle";
import TaskByDateList from "@/components/tasks/TaskByDateList";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { ChevronDown } from "lucide-react";


export default function Home() {
  return (
    <div className="flex flex-col items-center w-full mb-20 py-8">
      <div className="flex justify-between items-center mb-3 w-[80%] font-medium text-neutral-600">
        <div className="leading-snug">
          <h1 className="text-3xl font-bold text-neutral-800">Selamat Datang di</h1>
          <h2 className="text-3xl font-semibold text-[#2154C5]">BudidayaPlus</h2>
        </div>

        <Image
          className="w-32 h-32"
          src="/BudidayaPlus.svg"
          width={500}
          height={500}
          alt="BudidayaPlus Logo"
        />
      </div>

    <div className="flex items-center justify-center w-full">
      <div className="w-[80%] flex gap-2 items-center mb-1">
        <div className="h-5 w-0.5 bg-[#ff8585]" />
        <p className="text-start text-lg font-semibold text-neutral-700">
          {formatDate(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
        </p>
      </div>
    </div>

      <Cycle />

      <div className="flex flex-col items-center w-full">
        <h2 className="w-[80%] mt-10 mb-4 text-xl font-bold text-neutral-700">
          Tugas Hari Ini
        </h2>
        <TaskByDateList />
      </div>
 
    <div className="w-full flex justify-center mt-28">
      <details className="w-full md:w-[60%] max-w-md mx-auto rounded-lg shadow-md border group transition-all duration-300">
        <summary className="relative text-center px-4 py-3 text-lg font-semibold text-white bg-[#2254C5] cursor-pointer list-none group-open:mb-2 rounded-t-lg">
          Tentang Kami
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white transition-transform group-open:rotate-180" />
        </summary>
        <div className="px-4 pb-4 text-neutral-700 text-sm leading-relaxed text-center bg-[#EDF2FF] rounded-b-lg">
          <p>
            Dikembangkan oleh <strong>PT Dimensi Kreasi Nusantara</strong> sejak tahun 2024, aplikasi <strong>BudidayaPlus</strong> dirancang untuk membantu para peternak lele meningkatkan produktivitas dan profit usaha mereka.
          </p>
          <p className="mt-2">
            Kami berharap aplikasi ini menjadi solusi teknologi yang efektif, efisien, dan berdampak nyata bagi seluruh pengguna.
          </p>
          <p className="mt-4">
            Hormat kami, <br />
            <strong>PT Dimensi Kreasi Nusantara</strong>
          </p>
        </div>
      </details>
   </div>
    </div>
  );
}