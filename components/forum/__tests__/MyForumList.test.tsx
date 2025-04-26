import { render, screen, waitFor } from '@testing-library/react';
import ForumList from '@/components/forum/MyForumList';
import { getListForum } from '@/lib/forum/getListForum';
import { Forum } from '@/types/forum';
import '@testing-library/jest-dom';
import { useRouter } from 'next/navigation';

// Mock fungsi getListForum
jest.mock('@/lib/forum/getListForum');

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

const mockGetListForum = getListForum as jest.MockedFunction<typeof getListForum>;
const mockUseRouter = useRouter as jest.Mock;

describe('ForumList', () => {
  beforeEach(() => {
    mockUseRouter.mockReturnValue({
      push: jest.fn(),
    });
  });

  it('renders loading state initially', () => {
    render(<ForumList />);
    expect(screen.getByText('Memuat Forum ...')).toBeInTheDocument();
  });

  it('renders forums when data is successfully fetched', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: {
            first_name: 'John',
            last_name: 'Doe',
            id: 0,
            phone_number: '08123456789'
        },
        description: 'Forum 1',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
      },
      {
        id: '2',
        user: {
          first_name: 'Jane',
          last_name: 'Doe',
          id: 0,
          phone_number: '08123456780'
        },
        description: 'Forum 2',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList />);

    await waitFor(() => {
      expect(screen.getByText('Forum 1')).toBeInTheDocument();
      expect(screen.getByText('Forum 2')).toBeInTheDocument();
    });
  });

  it('renders error message when fetching fails', async () => {
    mockGetListForum.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<ForumList />);

    await waitFor(() => {
      expect(screen.getByText('Gagal memuat forumm')).toBeInTheDocument();
    });
  });

  it('renders message when no forums are available', async () => {
    mockGetListForum.mockResolvedValueOnce([]);

    render(<ForumList />);

    await waitFor(() => {
      expect(screen.getByText('Tidak ada forum yang tersedia.')).toBeInTheDocument();
    });
  });

  it('filters forums based on searchQuery', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
        description: 'Belajar React',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 0, phone_number: '08123456780' },
        description: 'Diskusi JavaScript',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
      },
    ];
  
    mockGetListForum.mockResolvedValueOnce(mockForums);
  
    render(<ForumList searchQuery="React" />);
  
    await waitFor(() => {
      expect(screen.getByText('Belajar React')).toBeInTheDocument();
      expect(screen.queryByText('Diskusi JavaScript')).not.toBeInTheDocument();
    });
  });

  it('shows not found message when no forum matches the search query', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
        description: 'Forum Belajar',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
      },
    ];
  
    mockGetListForum.mockResolvedValueOnce(mockForums);
  
    render(<ForumList searchQuery="Non Matching Keyword" />);
  
    await waitFor(() => {
      expect(screen.getByText('Forum tidak ditemukan.')).toBeInTheDocument();
    });
  });

});