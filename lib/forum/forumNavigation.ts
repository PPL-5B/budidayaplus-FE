import { Forum } from '@/types/forum';
import { useRouter } from 'next/navigation';
export const ForumNavigation = () => {
  const router = useRouter();


  const goToDetail = (forum: Forum) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('selectedForum', JSON.stringify(forum));
      router.push(`/forum/${forum.id}`);
    }
  };


  return { goToDetail };
};
