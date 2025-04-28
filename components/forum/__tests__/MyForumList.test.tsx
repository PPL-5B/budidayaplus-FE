import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ForumList from '@/components/forum/MyForumList';
import { getListForum } from '@/lib/forum/getListForum';
import { Forum } from '@/types/forum';
import '@testing-library/jest-dom';

// Mock getListForum
jest.mock('@/lib/forum/getListForum', () => ({
  getListForum: jest.fn(),
}));

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock ForumCard to include onDeleteSuccess
jest.mock('@/components/forum/ForumCard', () => ({
  __esModule: true,
  default: ({ forum, onDeleteSuccess }: any) => (
    <div>
      {forum.description}
      {onDeleteSuccess && (
        <button onClick={() => onDeleteSuccess(forum.id)}>Delete</button>
      )}
    </div>
  ),
}));

// Mock filterForums
jest.mock('@/components/forum/SearchForum', () => ({
  filterForums: (forums: Forum[], searchQuery: string, selectedTag: string) => {
    return forums.filter((forum) => 
      forum.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTag === '' || selectedTag === forum.tag)
    );
  },
}));

const mockGetListForum = getListForum as jest.MockedFunction<typeof getListForum>;

describe('ForumList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading state initially', () => {
    render(<ForumList selectedTag="" />);
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
          phone_number: '08123456789',
        },
        description: 'Forum 1',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
      },
      {
        id: '2',
        user: {
          first_name: 'Jane',
          last_name: 'Doe',
          id: 0,
          phone_number: '08123456780',
        },
        description: 'Forum 2',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum 1')).toBeInTheDocument();
      expect(screen.getByText('Forum 2')).toBeInTheDocument();
    });
  });

  it('renders error message when fetching fails', async () => {
    mockGetListForum.mockRejectedValueOnce(new Error('Failed to fetch'));

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Gagal memuat forum')).toBeInTheDocument();
    });
  });

  it('renders "Forum tidak ditemukan." when no forums are available', async () => {
    mockGetListForum.mockResolvedValueOnce([]);

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum tidak ditemukan.')).toBeInTheDocument();
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
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 0, phone_number: '08123456780' },
        description: 'Diskusi JavaScript',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList searchQuery="React" selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Belajar React')).toBeInTheDocument();
      expect(screen.queryByText('Diskusi JavaScript')).not.toBeInTheDocument();
    });
  });

  it('shows "Forum tidak ditemukan." when no forum matches the search query', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
        description: 'Forum Belajar',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList searchQuery="Non Matching Keyword" selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum tidak ditemukan.')).toBeInTheDocument();
    });
  });

  it('updates forum when updatedForum prop changes', async () => {
    const initialForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
        description: 'Initial Description',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
      },
    ];

    mockGetListForum.mockResolvedValueOnce(initialForums);

    const updatedForum: Forum = {
      id: '1',
      user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
      description: 'Updated Description',
      timestamp: new Date(),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 0,
      downvotes: 0,
    };

    const { rerender } = render(<ForumList selectedTag="" />);
    
    await waitFor(() => {
      expect(screen.getByText('Initial Description')).toBeInTheDocument();
    });

    rerender(<ForumList selectedTag="" updatedForum={updatedForum} />);
    
    await waitFor(() => {
      expect(screen.getByText('Updated Description')).toBeInTheDocument();
      expect(screen.queryByText('Initial Description')).not.toBeInTheDocument();
    });
  });

  it('removes forum when onDeleteSuccess is called', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
        description: 'Forum to be deleted',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 0, phone_number: '08123456780' },
        description: 'Forum to keep',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
      },
    ];
  
    mockGetListForum.mockResolvedValueOnce(mockForums);
  
    render(<ForumList selectedTag="" />);
  
    await waitFor(() => {
      expect(screen.getByText('Forum to be deleted')).toBeInTheDocument();
      expect(screen.getByText('Forum to keep')).toBeInTheDocument();
    });
  
    // Get all delete buttons and click the first one
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);
  
    await waitFor(() => {
      expect(screen.queryByText('Forum to be deleted')).not.toBeInTheDocument();
      expect(screen.getByText('Forum to keep')).toBeInTheDocument();
    });
  });

  it('updates only the matching forum when updatedForum prop changes', async () => {
    const initialForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
        description: 'Initial Description 1',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 0, phone_number: '08123456780' },
        description: 'Initial Description 2',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
      },
    ];
  
    mockGetListForum.mockResolvedValueOnce(initialForums);
  
    const updatedForum: Forum = {
      id: '1', // Only update forum with id '1'
      user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
      description: 'Updated Description',
      timestamp: new Date(),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 0,
      downvotes: 0,
    };
  
    const { rerender } = render(<ForumList selectedTag="" />);
    
    await waitFor(() => {
      expect(screen.getByText('Initial Description 1')).toBeInTheDocument();
      expect(screen.getByText('Initial Description 2')).toBeInTheDocument();
    });
  
    rerender(<ForumList selectedTag="" updatedForum={updatedForum} />);
    
    await waitFor(() => {
      // Forum with id '1' should be updated
      expect(screen.getByText('Updated Description')).toBeInTheDocument();
      
      // Forum with id '2' should remain unchanged
      expect(screen.getByText('Initial Description 2')).toBeInTheDocument();
      
      // Original description for forum '1' should be gone
      expect(screen.queryByText('Initial Description 1')).not.toBeInTheDocument();
    });
  });

  it('refetches forums when refresh prop changes', async () => {
    const initialForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 0, phone_number: '08123456789' },
        description: 'Initial Forum',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
      },
    ];

    const refreshedForums: Forum[] = [
      ...initialForums,
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 0, phone_number: '08123456780' },
        description: 'New Forum',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
      },
    ];

    mockGetListForum.mockResolvedValueOnce(initialForums);
    const { rerender } = render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Initial Forum')).toBeInTheDocument();
    });

    mockGetListForum.mockResolvedValueOnce(refreshedForums);
    rerender(<ForumList selectedTag="" refresh={1} />);

    await waitFor(() => {
      expect(screen.getByText('Initial Forum')).toBeInTheDocument();
      expect(screen.getByText('New Forum')).toBeInTheDocument();
    });
  });
});