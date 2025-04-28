import { filterForums } from '@/components/forum/SearchForum'; 
import { Forum } from '@/types/forum';

describe('filterForums', () => {
  const sampleForums: Forum[] = [
    {
      id: '1',
      user: { id: 1, first_name: 'lorem', last_name: 'ipsum', phone_number: '08123456789' },
      description: 'This is the first forum description',
      timestamp: new Date('2025-04-26T12:00:00Z'),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 0,
      downvotes: 0,
    },
    {
      id: '2',
      user: { id: 2, first_name: 'lorem', last_name: 'ipsum', phone_number: '08123456789' },
      description: 'This forum talks about something else',
      timestamp: new Date('2025-04-26T12:10:00Z'),
      parent_id: null,
      replies: [],
      tag: 'kolam',
      upvotes: 0,
      downvotes: 0,
    },
    {
      id: '3',
      user: { id: 3, first_name: 'lorem', last_name: 'ipsum', phone_number: '08123456789' },
      description: 'Forum discussing description filter functionality',
      timestamp: new Date('2025-04-26T12:20:00Z'),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 0,
      downvotes: 0,
    },
  ];

  it('returns all forums when query and selectedTag are empty', () => {
    const filteredForums = filterForums(sampleForums, '', '');

    expect(filteredForums.length).toBe(3);
  });

  it('filters forums based on description', () => {
    const filteredForums = filterForums(sampleForums, 'description filter', '');

    expect(filteredForums.length).toBe(1);
    expect(filteredForums[0].id).toBe('3');
  });

  it('returns empty array when no forum matches the query', () => {
    const filteredForums = filterForums(sampleForums, 'non-existent query', '');

    expect(filteredForums.length).toBe(0);
  });

  it('returns correct forum when query matches part of description', () => {
    const filteredForums = filterForums(sampleForums, 'talks about', '');

    expect(filteredForums.length).toBe(1);
    expect(filteredForums[0].id).toBe('2');
  });

  it('is case insensitive when filtering description', () => {
    const filteredForums = filterForums(sampleForums, 'THIS IS THE FIRST FORUM DESCRIPTION', '');

    expect(filteredForums.length).toBe(1);
    expect(filteredForums[0].id).toBe('1');
  });

  it('filters forums by selectedTag only if provided (no query)', () => {
    const filteredForums = filterForums(sampleForums, '', 'ikan');

    expect(filteredForums.length).toBe(2);
    expect(filteredForums.map(f => f.id)).toContain('1');
    expect(filteredForums.map(f => f.id)).toContain('3');
  });

  it('filters forums by both description and selectedTag together', () => {
    const filteredForums = filterForums(sampleForums, 'forum', 'kolam');

    expect(filteredForums.length).toBe(1);
    expect(filteredForums[0].id).toBe('2');
  });

  it('returns empty if tag does not match even if description matches', () => {
    const filteredForums = filterForums(sampleForums, 'forum', 'nonexistenttag');

    expect(filteredForums.length).toBe(0);
  });
});
