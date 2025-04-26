import { filterForums } from '@/components/forum/SearchForum'; 
import { Forum } from '@/types/forum';

describe('filterForums', () => {
  it('should return all forums when query is empty', () => {
    const sampleForums: Forum[] = [
      {
        id: '1',
        user: {
          id: 1,
          first_name: 'lorem',
          last_name: 'ipsum',
          phone_number: '08123456789',
        },
        description: 'This is the first forum description',
        timestamp: new Date('2025-04-26T12:00:00Z'),
        parent_id: null,
        replies: [],
      },
      {
        id: '2',
        user: {
            id: 2,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This forum talks about something else',
        timestamp: new Date('2025-04-26T12:10:00Z'),
        parent_id: null,
        replies: [],
      },
    ];

    const query = ''; 
    const filteredForums = filterForums(sampleForums, query);

    expect(filteredForums.length).toBe(2); 
  });

  it('should filter forums based on description', () => {
    const sampleForums: Forum[] = [
      {
        id: '1',
        user: {
            id: 1,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This is the first forum description',
        timestamp: new Date('2025-04-26T12:00:00Z'),
        parent_id: null,
        replies: [],
      },
      {
        id: '2',
        user: {
            id: 2,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This forum talks about something else',
        timestamp: new Date('2025-04-26T12:10:00Z'),
        parent_id: null,
        replies: [],
      },
      {
        id: '3',
        user: {
            id: 3,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'Forum discussing description filter functionality',
        timestamp: new Date('2025-04-26T12:20:00Z'),
        parent_id: null,
        replies: [],
      },
    ];

    const query = 'description filter';
    const filteredForums = filterForums(sampleForums, query);

    expect(filteredForums.length).toBe(1); 
    expect(filteredForums[0].id).toBe('3'); 
  });

  it('should return an empty array when no forum matches the query', () => {
    const sampleForums: Forum[] = [
      {
        id: '1',
        user: {
            id: 1,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This is the first forum description',
        timestamp: new Date('2025-04-26T12:00:00Z'),
        parent_id: null,
        replies: [],
      },
      {
        id: '2',
        user: {
            id: 2,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This forum talks about something else',
        timestamp: new Date('2025-04-26T12:10:00Z'),
        parent_id: null,
        replies: [],
      },
    ];

    const query = 'non-existent query';
    const filteredForums = filterForums(sampleForums, query);

    expect(filteredForums.length).toBe(0); 
  });

  it('should return the correct forums when query matches part of the description', () => {
    const sampleForums: Forum[] = [
      {
        id: '1',
        user: {
            id: 1,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This is the first forum description',
        timestamp: new Date('2025-04-26T12:00:00Z'),
        parent_id: null,
        replies: [],
      },
      {
        id: '2',
        user: {
            id: 2,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This forum talks about something else',
        timestamp: new Date('2025-04-26T12:10:00Z'),
        parent_id: null,
        replies: [],
      },
      {
        id: '3',
        user: {
            id: 3,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'Forum discussing description filter functionality',
        timestamp: new Date('2025-04-26T12:20:00Z'),
        parent_id: null,
        replies: [],
      },
    ];

    const query = 'talks about';
    const filteredForums = filterForums(sampleForums, query);

    expect(filteredForums.length).toBe(1); 
    expect(filteredForums[0].id).toBe('2'); 
  });

  it('should return forums with description in different cases', () => {
    const sampleForums: Forum[] = [
      {
        id: '1',
        user: {
            id: 1,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This is the first forum description',
        timestamp: new Date('2025-04-26T12:00:00Z'),
        parent_id: null,
        replies: [],
      },
      {
        id: '2',
        user: {
            id: 2,
            first_name: 'lorem',
            last_name: 'ipsum',
            phone_number: '08123456789',
        },
        description: 'This forum talks about something else',
        timestamp: new Date('2025-04-26T12:10:00Z'),
        parent_id: null,
        replies: [],
      },
    ];

    const query = 'THIS IS THE FIRST FORUM DESCRIPTION'; 
    const filteredForums = filterForums(sampleForums, query);

    expect(filteredForums.length).toBe(1); 
    expect(filteredForums[0].id).toBe('1'); 
  });
});