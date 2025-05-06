import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForumCard from '../ForumCard';
import { Forum } from '@/types/forum';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock DeleteForumContainer
jest.mock('../DeleteForumContainer', () => ({
  __esModule: true,
  default: function MockDeleteForumContainer({ isOpen, onClose, onSuccess }: { isOpen: boolean; onClose: () => void; onSuccess: () => void }) {
    React.useEffect(() => {
      if (isOpen) {
        onSuccess();
        onClose();
      }
    }, [isOpen, onSuccess, onClose]);
    return <div data-testid="mock-delete-container" />;
  },
}));

// Mock ForumCardFooter supaya tidak tergantung vote style
jest.mock('../ForumCardFooter', () => ({
  __esModule: true,
  default: ({
    onEdit,
    onDelete,
    onViewDetails,
    handleVote,
  }: {
    onEdit: () => void;
    onDelete: () => void;
    onViewDetails: () => void;
    handleVote: (type: 'upvote' | 'downvote') => void;
  }) => (
    <div>
      <button onClick={onEdit}>Edit</button>
      <button onClick={onDelete}>Hapus</button>
      <button onClick={onViewDetails}>Lihat Unggahan</button>
      <button onClick={() => handleVote('upvote')}>Upvote</button>
      <button onClick={() => handleVote('downvote')}>Downvote</button>
    </div>
  ),
}));

// Mock useVote
jest.mock('@/hooks/useVote', () => ({
  useVote: jest.fn(),
}));

import { useVote } from '@/hooks/useVote';

describe('ForumCard', () => {
  const mockPush = jest.fn();
  const forumMock: Forum = {
    id: '1',
    description: 'Example forum content for test.',
    timestamp: new Date('2025-04-21T10:00:00Z'),
    user: {
      id: 99,
      first_name: 'Jane',
      last_name: 'Doe',
      phone_number: '08123456789',
    },
    parent_id: null,
    replies: [],
    tag: 'ikan',
    upvotes: 10,
    downvotes: 2,
    title: 'Sample Title',
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useVote as jest.Mock).mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote: jest.fn(),
    });
    Storage.prototype.setItem = jest.fn();
    jest.clearAllMocks();
  });

  it('renders loading state if not initialized', () => {
    (useVote as jest.Mock).mockReturnValue({
      isInitialized: false,
    });

    render(<ForumCard forum={forumMock} />);
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('renders forum card properly when initialized', () => {
    render(<ForumCard forum={forumMock} />);
    expect(screen.getByText(/Lihat Unggahan/i)).toBeInTheDocument();
    expect(screen.getByText('Example forum content for test.')).toBeInTheDocument();
  });

  it('navigates to forum details and sets localStorage when "Lihat Unggahan" clicked', () => {
    render(<ForumCard forum={forumMock} />);
    fireEvent.click(screen.getByText('Lihat Unggahan'));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'selectedForum',
      JSON.stringify(forumMock)
    );
    expect(mockPush).toHaveBeenCalledWith('/forum/1');
  });

  it('allows editing the forum description and saving changes', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });
    fireEvent.click(screen.getByText('Simpan'));

    expect(screen.getByText('Updated description')).toBeInTheDocument();
  });

  it('cancels editing and restores the original description', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Discard this' } });
    fireEvent.click(screen.getByText('Batal'));

    expect(screen.getByText('Example forum content for test.')).toBeInTheDocument();
  });

  it('opens delete modal when "Hapus" clicked', () => {
    render(<ForumCard forum={forumMock} />);
    fireEvent.click(screen.getByText('Hapus'));

    expect(screen.getByTestId('mock-delete-container')).toBeInTheDocument();
  });

  it('calls onDeleteSuccess when delete confirmed', () => {
    const mockOnDeleteSuccess = jest.fn();
    render(<ForumCard forum={forumMock} onDeleteSuccess={mockOnDeleteSuccess} />);
    fireEvent.click(screen.getByText('Hapus'));

    expect(screen.getByTestId('mock-delete-container')).toBeInTheDocument();
    expect(mockOnDeleteSuccess).toHaveBeenCalledWith('1');
  });

  it('cancels vote when user already upvoted and clicks upvote again', async () => {
    const handleCancelVote = jest.fn();
    (useVote as jest.Mock).mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: 'upvote',
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote,
    });

    render(<ForumCard forum={forumMock} />);
    fireEvent.click(screen.getByText('Upvote'));

    await waitFor(() => {
      expect(handleCancelVote).toHaveBeenCalled();
    });
  });

  it('cancels vote when user already downvoted and clicks downvote again', async () => {
    const handleCancelVote = jest.fn();
    (useVote as jest.Mock).mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: 'downvote',
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote,
    });

    render(<ForumCard forum={forumMock} />);
    fireEvent.click(screen.getByText('Downvote'));

    await waitFor(() => {
      expect(handleCancelVote).toHaveBeenCalled();
    });
  });

  it('handles error when voting fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (useVote as jest.Mock).mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn().mockRejectedValueOnce(new Error('Vote error')),
      handleDownvote: jest.fn(),
      handleCancelVote: jest.fn(),
    });

    render(<ForumCard forum={forumMock} />);
    fireEvent.click(screen.getByText('Upvote'));

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error voting:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  it('handles voting (upvote and downvote)', async () => {
    const handleUpvote = jest.fn();
    const handleDownvote = jest.fn();
    const handleCancelVote = jest.fn();

    (useVote as jest.Mock).mockReturnValue({
      upvotes: 5,
      downvotes: 1,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote,
      handleDownvote,
      handleCancelVote,
    });

    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Upvote'));
    await waitFor(() => {
      expect(handleUpvote).toHaveBeenCalled();
    });

    fireEvent.click(screen.getByText('Downvote'));
    await waitFor(() => {
      expect(handleDownvote).toHaveBeenCalled();
    });
  });

  it('calls onVoteSuccess when saving edited description', () => {
    const mockOnVoteSuccess = jest.fn();

    render(<ForumCard forum={forumMock} onVoteSuccess={mockOnVoteSuccess} />);

    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated by Save' } });
    fireEvent.click(screen.getByText('Simpan'));

    expect(mockOnVoteSuccess).toHaveBeenCalledWith(
      expect.objectContaining({
        ...forumMock,
        description: 'Updated by Save',
      })
    );
  });

  it('calls onVoteSuccess when voting succeeds', async () => {
    const mockOnVoteSuccess = jest.fn();

    (useVote as jest.Mock).mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote: jest.fn(),
    });

    render(<ForumCard forum={forumMock} onVoteSuccess={mockOnVoteSuccess} />);
    fireEvent.click(screen.getByText('Upvote'));

    await waitFor(() => {
      expect(mockOnVoteSuccess).toHaveBeenCalledWith(
        expect.objectContaining({
          ...forumMock,
          upvotes: 10,
          downvotes: 2,
        })
      );
    });
  });
});
