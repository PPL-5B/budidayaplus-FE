import { Forum } from '@/types/forum';

export function filterForums(forums: Forum[], query: string): Forum[] {
  if (!query) return forums;

  const lowerQuery = query.toLowerCase();
  return forums.filter(
    (forum) =>
      forum.description?.toLowerCase().includes(lowerQuery)
  );
}