// lib/forum/useForumNavigation.ts
import { useRouter } from 'next/navigation';
import { Forum } from '@/types/forum';

export const useForumNavigation = () => {
  const router = useRouter();

  const goToDetail = (forum: Forum) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedForum', JSON.stringify(forum));
      router.push(`/forum/${forum.id}`);
    }
  };

  return { goToDetail };
};