import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ForumList from '@/components/forum/MyForumList';
import { getListForum } from '@/lib/forum/getListForum';
import { Forum } from '@/types/forum';
import '@testing-library/jest-dom';

// Mock getListForum
jest.mock('@/lib/forum/getListForum', () => ({
  getListForum: jest.fn(),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
  }),
}));

// Mock ForumCard
jest.mock('@/components/forum/ForumCard', () => ({
  __esModule: true,
  default: (props: { forum: { id: string; description: string }; onDeleteSuccess?: (id: string) => void }) => (
    <div>
      {props.forum.description}
      {props.onDeleteSuccess && (
        <button onClick={() => props.onDeleteSuccess?.(props.forum.id)}>Delete</button>
      )}
    </div>
  ),
}));

// Mock filterForums
jest.mock('@/components/forum/SearchForum', () => ({
  filterForums: (forums: Forum[], searchQuery: string, selectedTag: string) => {
    return forums.filter((forum) =>
      forum.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTag === '' || forum.tag === selectedTag)
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
        user: { first_name: 'John', last_name: 'Doe', id: 1, phone_number: '08123456789' },
        description: 'Forum 1',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 2, phone_number: '08123456780' },
        description: 'Forum 2',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum 1')).toBeInTheDocument();
      expect(screen.getByText('Forum 2')).toBeInTheDocument();
    });
  });

  it('renders error message if fetching fails', async () => {
    mockGetListForum.mockRejectedValueOnce(new Error('Fetch failed'));

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Gagal memuat forum')).toBeInTheDocument();
    });
  });

  it('renders "Forum tidak ditemukan." if no forums match', async () => {
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
        user: { first_name: 'John', last_name: 'Doe', id: 1, phone_number: '08123456789' },
        description: 'Belajar React',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 2, phone_number: '08123456780' },
        description: 'Diskusi JavaScript',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList selectedTag="" searchQuery="React" />);

    await waitFor(() => {
      expect(screen.getByText('Belajar React')).toBeInTheDocument();
      expect(screen.queryByText('Diskusi JavaScript')).not.toBeInTheDocument();
    });
  });

  it('shows "Forum tidak ditemukan." if no forum matches search query', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 1, phone_number: '08123456789' },
        description: 'Forum Belajar',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList selectedTag="" searchQuery="Nonexistent" />);

    await waitFor(() => {
      expect(screen.getByText('Forum tidak ditemukan.')).toBeInTheDocument();
    });
  });

  it('updates forum description when updatedForum prop is passed', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 1, phone_number: '08123456789' },
        description: 'Old Description',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    const { rerender } = render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Old Description')).toBeInTheDocument();
    });

    const updatedForum: Forum = {
      ...mockForums[0],
      description: 'Updated Description',
    };

    rerender(<ForumList selectedTag="" updatedForum={updatedForum} />);

    await waitFor(() => {
      expect(screen.getByText('Updated Description')).toBeInTheDocument();
      expect(screen.queryByText('Old Description')).not.toBeInTheDocument();
    });
  });

  it('updates only the matching forum when updatedForum prop changes', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 1, phone_number: '08123456789' },
        description: 'Old Description 1',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
        title: '',
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Smith', id: 2, phone_number: '08123456780' },
        description: 'Old Description 2',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
        title: '',
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    const { rerender } = render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByTestId('forum-1')).toHaveTextContent('Old Description 1');
      expect(screen.getByTestId('forum-2')).toHaveTextContent('Old Description 2');
    });

    const updatedForum: Forum = {
      ...mockForums[0],
      description: 'Updated Description 1',
    };

    rerender(<ForumList selectedTag="" updatedForum={updatedForum} />);

    await waitFor(() => {
      expect(screen.getByTestId('forum-1')).toHaveTextContent('Updated Description 1');
      expect(screen.getByTestId('forum-2')).toHaveTextContent('Old Description 2');
    });
  });

  it('removes forum from list when onDeleteSuccess is called', async () => {
    const mockForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 1, phone_number: '08123456789' },
        description: 'Forum to delete',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 2, phone_number: '08123456780' },
        description: 'Forum to keep',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
    ];

    mockGetListForum.mockResolvedValueOnce(mockForums);

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum to delete')).toBeInTheDocument();
      expect(screen.getByText('Forum to keep')).toBeInTheDocument();
    });

    const deleteButton = screen.getAllByText('Delete')[0];
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Forum to delete')).not.toBeInTheDocument();
      expect(screen.getByText('Forum to keep')).toBeInTheDocument();
    });
  });

  it('refetches forums when refresh prop changes', async () => {
    const initialForums: Forum[] = [
      {
        id: '1',
        user: { first_name: 'John', last_name: 'Doe', id: 1, phone_number: '08123456789' },
        description: 'Initial Forum',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'ikan',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
    ];

    const newForums: Forum[] = [
      ...initialForums,
      {
        id: '2',
        user: { first_name: 'Jane', last_name: 'Doe', id: 2, phone_number: '08123456780' },
        description: 'New Forum',
        timestamp: new Date(),
        parent_id: null,
        replies: [],
        tag: 'kolam',
        upvotes: 0,
        downvotes: 0,
        title: ''
      },
    ];

    mockGetListForum.mockResolvedValueOnce(initialForums);

    const { rerender } = render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Initial Forum')).toBeInTheDocument();
    });

    mockGetListForum.mockResolvedValueOnce(newForums);
    rerender(<ForumList selectedTag="" refresh={1} />);

    await waitFor(() => {
      expect(screen.getByText('New Forum')).toBeInTheDocument();
      expect(screen.getByText('Initial Forum')).toBeInTheDocument();
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
        title: ''
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
        title: ''
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
      title: ''
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
});
