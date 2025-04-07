'use client';

import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser"; // Sesuaikan path-nya

export default function ForumButton() {
  const user = useUser();
  const router = useRouter();

  if (!user) return null;

  return (
    <button
      onClick={() => router.push(`/forum`)}
      className="px-4 py-2 mt-6 rounded-md bg-blue-600 text-white hover:bg-blue-700"
    >
      Ke Forum
    </button>
  );
}
