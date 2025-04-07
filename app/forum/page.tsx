'use client';

import ForumListDummy from "@/components/forum/ForumListDummy";
import { useUser } from "@/hooks/useUser";
import { useEffect } from "react";

export default function ForumPage() {
  const user = useUser();

  useEffect(() => {
    if (user) {
      console.log("Nomor telepon user:", user.phone_number);
      // fetch forum berdasarkan nomor atau id user
    }
  }, [user]);

  if (!user) return <p>Loading...</p>;

  return (
    <>
      <div>
        <h1>Forum Saya</h1>
        <p>Selamat datang, {user.first_name}!</p>
        {/* render forum di sini */}
      </div>

      <div className="p-6">
        <h1 className="text-2xl font-bold">Forum Dummy</h1>
        <ForumListDummy />
      </div>
    </>
  );
}
