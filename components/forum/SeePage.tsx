import Link from "next/link";
import React from "react";

export default function SeePage() {
  return (
  <div className="flex justify-center mt-6">
    <Link
      href="/forum"
      className="inline-block bg-[#2254C5] hover:bg-[#1e46a1] text-white px-6 py-2 rounded-md text-sm shadow transition"
    >
      Lihat Semua Forum
    </Link>
  </div>

  );
}
