'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import DetailForum from '@/components/forum/DetailForum';

interface ForumDetail {
  id: number;
  description: string;
  timestamp: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
}

const ForumDetailPage = () => {
  const [forum, setForum] = useState<ForumDetail | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedForum = localStorage.getItem('selectedForum');
      if (storedForum) {
        setForum(JSON.parse(storedForum));
      } else {
        router.push('/forum');
      }
    }
  }, [router]);

  if (!forum) {
    return <div className="p-4">Memuat data forum...</div>;
  }

  return <DetailForum forum={forum} />;
};

export default ForumDetailPage;