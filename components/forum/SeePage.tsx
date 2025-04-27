import Link from "next/link";
import React from "react";

export default function SeePage() {
  return (
    <Link href="/forum">
      <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-300">
        Mulai Forum 
      </button>
    </Link>
  );
}
