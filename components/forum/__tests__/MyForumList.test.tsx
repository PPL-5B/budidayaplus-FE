import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ForumList from '@/components/forum/MyForumList';
import { getListForum } from '@/lib/forum/getListForum';
import { Forum } from '@/types/forum';
import '@testing-library/jest-dom';

// Mocking
jest.mock('@/lib/forum/getListForum', () => ({ getListForum: jest.fn() }));
jest.mock('next/navigation', () => ({ useRouter: jest.fn().mockReturnValue({ push: jest.fn() }) }));
jest.mock('@/components/forum/ForumCard', () => ({
  __esModule: true,
  default: ({ forum, onDeleteSuccess }: any) => (
    <div>
      {forum.description}
      {onDeleteSuccess && <button onClick={() => onDeleteSuccess(forum.id)}>Delete</button>}
    </div>
  ),
}));
jest.mock('@/components/forum/SearchForum', () => ({
  filterForums: (forums: Forum[], searchQuery: string, selectedTag: string) => 
    forums.filter((forum) => 
      forum.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
      (selectedTag === '' || selectedTag === forum.tag)
    ),
}));

const mockGetListForum = getListForum as jest.MockedFunction<typeof getListForum>;

describe('ForumList', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders loading initially', () => {
    render(<ForumList selectedTag="" />);
    expect(screen.getByText('Memuat Forum ...')).toBeInTheDocument();
  });

  it('renders forums when data is fetched', async () => {
    mockGetListForum.mockResolvedValueOnce([
      { id: '1', user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' }, description: 'Forum 1', timestamp: new Date(), parent_id: null, replies: [], tag: 'ikan', upvotes: 0, downvotes: 0 },
    ]);

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum 1')).toBeInTheDocument();
    });
  });

  it('shows error if fetch fails', async () => {
    mockGetListForum.mockRejectedValueOnce(new Error('Failed'));

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Gagal memuat forum')).toBeInTheDocument();
    });
  });

  it('shows "Forum tidak ditemukan." when no forums', async () => {
    mockGetListForum.mockResolvedValueOnce([]);

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum tidak ditemukan.')).toBeInTheDocument();
    });
  });

  it('filters forums by searchQuery', async () => {
    mockGetListForum.mockResolvedValueOnce([
      { id: '1', user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' }, description: 'React Learning', timestamp: new Date(), parent_id: null, replies: [], tag: 'ikan', upvotes: 0, downvotes: 0 },
      { id: '2', user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' }, description: 'Vue Basics', timestamp: new Date(), parent_id: null, replies: [], tag: 'ikan', upvotes: 0, downvotes: 0 },
    ]);

    render(<ForumList selectedTag="" searchQuery="React" />);

    await waitFor(() => {
      expect(screen.getByText('React Learning')).toBeInTheDocument();
      expect(screen.queryByText('Vue Basics')).not.toBeInTheDocument();
    });
  });

  it('updates forum when updatedForum is passed', async () => {
    mockGetListForum.mockResolvedValueOnce([
      { id: '1', user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' }, description: 'Old Description', timestamp: new Date(), parent_id: null, replies: [], tag: 'ikan', upvotes: 0, downvotes: 0 },
    ]);

    const { rerender } = render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Old Description')).toBeInTheDocument();
    });

    rerender(<ForumList selectedTag="" updatedForum={{
      id: '1',
      user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' },
      description: 'New Description',
      timestamp: new Date(),
      parent_id: null,
      replies: [],
      tag: 'ikan',
      upvotes: 0,
      downvotes: 0,
    }} />);

    await waitFor(() => {
      expect(screen.getByText('New Description')).toBeInTheDocument();
      expect(screen.queryByText('Old Description')).not.toBeInTheDocument();
    });
  });

  it('deletes forum on onDeleteSuccess', async () => {
    mockGetListForum.mockResolvedValueOnce([
      { id: '1', user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' }, description: 'Forum A', timestamp: new Date(), parent_id: null, replies: [], tag: 'ikan', upvotes: 0, downvotes: 0 },
    ]);

    render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Forum A')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Delete'));

    await waitFor(() => {
      expect(screen.queryByText('Forum A')).not.toBeInTheDocument();
    });
  });

  it('refetches forums when refresh changes', async () => {
    mockGetListForum.mockResolvedValueOnce([
      { id: '1', user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' }, description: 'Initial Forum', timestamp: new Date(), parent_id: null, replies: [], tag: 'ikan', upvotes: 0, downvotes: 0 },
    ]);

    const { rerender } = render(<ForumList selectedTag="" />);

    await waitFor(() => {
      expect(screen.getByText('Initial Forum')).toBeInTheDocument();
    });

    mockGetListForum.mockResolvedValueOnce([
      { id: '1', user: { first_name: 'A', last_name: 'B', id: 0, phone_number: '0' }, description: 'Initial Forum', timestamp: new Date(), parent_id: null, replies: [], tag: 'ikan', upvotes: 0, downvotes: 0 },
      { id: '2', user: { first_name: 'C', last_name: 'D', id: 0, phone_number: '0' }, description: 'New Forum', timestamp: new Date(), parent_id: null, replies: [], tag: 'kolam', upvotes: 0, downvotes: 0 },
    ]);

    rerender(<ForumList selectedTag="" refresh={1} />);

    await waitFor(() => {
      expect(screen.getByText('New Forum')).toBeInTheDocument();
    });
  });
});
