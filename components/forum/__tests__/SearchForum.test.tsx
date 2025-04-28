import { filterForums } from '@/components/forum/SearchForum';
import { Forum } from '@/types/forum';

describe('filterForums', () => {
  const sampleForums: Forum[] = [
    {
      id: '1',
      user: {
        id: 1,
        first_name: 'lorem',
        last_name: 'ipsum',
        phone_number: '08123456789',
      },
      title: 'React Tips and Tricks',
      description: 'Description 1',
      timestamp: new Date('2025-04-26T12:00:00Z'),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 10,
      downvotes: 2,
    },
    {
      id: '2',
      user: {
        id: 2,
        first_name: 'lorem',
        last_name: 'ipsum',
        phone_number: '08123456789',
      },
      title: 'Next.js vs Remix',
      description: 'Description 2',
      timestamp: new Date('2025-04-26T12:10:00Z'),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 5,
      downvotes: 1,
    },
    {
      id: '3',
      user: {
        id: 3,
        first_name: 'lorem',
        last_name: 'ipsum',
        phone_number: '08123456789',
      },
      title: 'Understanding TypeScript',
      description: 'Description 3',
      timestamp: new Date('2025-04-26T12:20:00Z'),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 8,
      downvotes: 0,
    },
  ];

  it('should return all forums when query and selectedTag are empty', () => {
    const result = filterForums(sampleForums, '', '');
    expect(result).toEqual(sampleForums);
  });

  it('should filter forums based on title only', () => {
    const result = filterForums(sampleForums, 'react', '');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('1');
  });

  it('should filter forums based on selectedTag only', () => {
    const result = filterForums(sampleForums, '', 'Next.js');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('2');
  });

  it('should filter forums based on both title and selectedTag', () => {
    const result = filterForums(sampleForums, 'type', 'TypeScript');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('3');
  });

  it('should return empty array if no forums match query', () => {
    const result = filterForums(sampleForums, 'vue', '');
    expect(result.length).toBe(0);
  });

  it('should return empty array if no forums match selectedTag', () => {
    const result = filterForums(sampleForums, '', 'Vue');
    expect(result.length).toBe(0);
  });

  it('should return empty array if no forums match both query and selectedTag', () => {
    const result = filterForums(sampleForums, 'vue', 'React');
    expect(result.length).toBe(0);
  });

  it('should perform case insensitive search on title', () => {
    const result = filterForums(sampleForums, 'UNDERSTANDING TYPESCRIPT', '');
    expect(result.length).toBe(1);
    expect(result[0].id).toBe('3');
  });
});
