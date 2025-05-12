// __tests__/ForumCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForumCard from '@/components/forum/ForumCard';
import { Forum } from '@/types/forum';

jest.mock('@/lib/forum/forumNavigation', () => ({
  useForumNavigation: () => ({
    goToDetail: jest.fn(),
  }),
}));

jest.mock('@/hooks/useUser', () => ({
  useUser: () => ({
    id: 99,
    first_name: 'Jane',
  }),
}));

jest.mock('@/hooks/useVote', () => ({
  useVote: jest.fn(),
}));

jest.mock('@/components/forum/DeleteForumContainer', () => ({
  __esModule: true,
  default: ({ isOpen, onSuccess, onClose }: any) => {
    if (isOpen) {
      onSuccess();
      onClose();
    }
    return <div data-testid="mock-delete" />;
  },
}));

jest.mock('@/components/forum/ForumCardFooter', () => ({
  __esModule: true,
  default: ({ onEdit, onDelete, onViewDetails, handleVote }: any) => (
    <div>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Hapus</button>
      <button onClick={onViewDetails}>Lihat Unggahan</button>
      <button onClick={() => handleVote('upvote')}>Upvote</button>
    </div>
  ),
}));

import { useVote } from '@/hooks/useVote';

describe('ForumCard', () => {
  const forum: Forum = {
    id: '1',
    description: 'Deskripsi test',
    timestamp: new Date('2025-05-13T04:15:01Z'),
    user: { id: 99, first_name: 'Jane', last_name: 'Doe', phone_number: '08123456789' },
    parent_id: null,
    replies: [],
    tag: 'ikan',
    upvotes: 5,
    downvotes: 0,
    title: 'Forum 1',
  };

  beforeEach(() => {
    (useVote as jest.Mock).mockReturnValue({
      upvotes: 5,
      downvotes: 0,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleCancelVote: jest.fn(),
    });
    jest.clearAllMocks();
  });

  it('shows loading if not initialized', () => {
    (useVote as jest.Mock).mockReturnValue({ isInitialized: false });
    render(<ForumCard forum={forum} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders forum content', () => {
    render(<ForumCard forum={forum} />);
    expect(screen.getByText('Forum 1')).toBeInTheDocument();
    expect(screen.getByText('Deskripsi test')).toBeInTheDocument();
  });

  it('can enter edit mode and save', () => {
    render(<ForumCard forum={forum} />);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Updated!' } });
    fireEvent.click(screen.getByText('Simpan'));
    expect(screen.getByText('Updated!')).toBeInTheDocument();
  });

  it('cancel editing restores original text', () => {
    render(<ForumCard forum={forum} />);
    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Discard' } });
    fireEvent.click(screen.getByText('Batal'));
    expect(screen.getByText('Deskripsi test')).toBeInTheDocument();
  });

  it('calls delete modal and callback', () => {
    const onDeleteSuccess = jest.fn();
    render(<ForumCard forum={forum} onDeleteSuccess={onDeleteSuccess} />);
    fireEvent.click(screen.getByText('Hapus'));
    expect(screen.getByTestId('mock-delete')).toBeInTheDocument();
    expect(onDeleteSuccess).toHaveBeenCalledWith('1');
  });

  it('calls vote and voteSuccess callback', async () => {
    const handleUpvote = jest.fn();
    (useVote as jest.Mock).mockReturnValue({
      upvotes: 5,
      downvotes: 0,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote,
      handleCancelVote: jest.fn(),
    });

    render(<ForumCard forum={forum} />);
    fireEvent.click(screen.getByText('Upvote'));

    await waitFor(() => {
      expect(handleUpvote).toHaveBeenCalled();
    });
  });
});