import { Forum } from '@/types/forum';

export function filterForums(forums: Forum[], query: string, selectedTag: string): Forum[] {
  const lowerQuery = query.toLowerCase();

  return forums
    .filter((forum) =>
      forum.title?.toLowerCase().includes(lowerQuery)
    )
    .filter((forum) =>
      selectedTag ? forum.tag === selectedTag : true
    );
}