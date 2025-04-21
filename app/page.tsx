import React from "react";
import Cycle from "@/components/cycle/Cycle"; // The file above
import TaskByDateList from "@/components/tasks/TaskByDateList";
import { formatDate } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import AboutUS from "./about-us/page";

export default function Home() {
  return (
    <div className="flex flex-col items-center w-full mb-20 py-8">
      <div className="flex justify-between items-center mb-3 w-[80%] font-medium text-neutral-600">
        <div className="text-3xl">
          <p>Welcome to</p>
          <p className="text-[#2154C5] font-normal">BudidayaPlus</p>
        </div>
        <Image
          className="w-32 h-32"
          src="/BudidayaPlus.svg"
          width={500}
          height={500}
          alt="BudidayaPlus Logo"
        />
      </div>

      <div className="flex gap-2 items-center justify-center w-full">
        <div className="w-[80%] flex gap-2">
          <div className="h-5 w-0.5 bg-[#ff8585]" />
          <p className="text-start">
            {formatDate(new Date(), "EEEE, dd MMMM yyyy", { locale: id })}
          </p>
        </div>
      </div>

      {/* Renders your Cycle component with both buttons */}
      <Cycle />

      <div className="flex flex-col items-center w-full">
        <p className="mt-10 py-10 pb-5 w-[80%] text-2xl font-medium text-neutral-60">
          Tugas Hari Ini
        </p>
        <TaskByDateList />
      </div>
      {/*
      <div className="flex flex-col items-center w-full">
         <AboutUS/>
      </div> 
      */}
      {/* Tentang Kami Section */}
      <div className="w-full flex justify-center mt-28">
  <details className="w-full md:w-[60%] rounded-md bg-neutral-100 text-center group">
    <summary className="px-4 py-3 text-lg text-black font-medium cursor-pointer list-none group-open:mb-4">
      Tentang Kami
    </summary>
    <div className="px-4 pb-4 text-neutral-700 leading-relaxed">
      <p>
        Dikembangkan oleh <strong>PT Dimensi Kreasi Nusantara</strong> sejak tahun 2024,
        aplikasi <strong>BudidayaPlus</strong> dirancang untuk membantu para peternak lele meningkatkan
        produktivitas dan profit usaha mereka.
      </p>
      <p className="mt-2">
        Kami berharap aplikasi ini menjadi solusi teknologi yang efektif, efisien, dan berdampak nyata bagi seluruh pengguna.
      </p>
      <p className="mt-4">Hormat kami, <br /> <strong>PT Dimensi Kreasi Nusantara</strong></p>
    </div>
   </details>
   </div>
    </div>

  );
}
