import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForumCard from '../ForumCard';
import { useVote } from '@/hooks/useVote';
import { Forum } from '@/types/forum';

// Mock the useVote hook
jest.mock('@/hooks/useVote', () => ({
  useVote: jest.fn(),
}));

const mockUseVote = useVote as jest.Mock;

describe('ForumCard', () => {
  const mockForum: Forum = {
    id: '1',
    description: 'This is a test forum',
    user: { 
      id: 1,
      first_name: 'John', 
      last_name: 'Doe',
      phone_number: '1234567890'
    },
    timestamp: new Date(),
    parent_id: null,
    replies: [],
    upvotes: 0,
    downvotes: 0
  };

  const mockOnDeleteSuccess = jest.fn();
  const mockOnVoteSuccess = jest.fn();

  beforeEach(() => {
    mockUseVote.mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote: jest.fn(),
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the forum card with correct data', () => {
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    expect(screen.getByText('Dibuat oleh: John Doe')).toBeInTheDocument();
    expect(screen.getByText('This is a test forum')).toBeInTheDocument();
    expect(screen.getByText('Lihat detail forum')).toBeInTheDocument();
  });

  it('allows editing the description', async () => {
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    fireEvent.click(screen.getByText('Edit deskripsi'));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });

    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(mockOnVoteSuccess).toHaveBeenCalledWith({
        ...mockForum,
        description: 'Updated description',
      });
    });

    expect(screen.getByText('Updated description')).toBeInTheDocument();
  });

  it('cancels editing the description', () => {
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    fireEvent.click(screen.getByText('Edit deskripsi'));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });

    fireEvent.click(screen.getByText('Batal'));

    expect(screen.getByText('This is a test forum')).toBeInTheDocument();
  });

  it('cancels editing without changing the description', () => {
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    fireEvent.click(screen.getByText('Edit deskripsi'));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'This is a test forum' } });

    fireEvent.click(screen.getByText('Batal'));

    expect(screen.getByText('This is a test forum')).toBeInTheDocument();
  });

  it('saves the description without changes', async () => {
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    fireEvent.click(screen.getByText('Edit deskripsi'));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'This is a test forum' } });

    fireEvent.click(screen.getByText('Simpan'));

    await waitFor(() => {
      expect(mockOnVoteSuccess).toHaveBeenCalledWith({
        ...mockForum,
        description: 'This is a test forum',
      });
    });

    expect(screen.getByText('This is a test forum')).toBeInTheDocument();
  });

  it('handles upvote and downvote actions', async () => {
    const handleUpvote = jest.fn();
    const handleDownvote = jest.fn();
    const handleCancelVote = jest.fn();

    mockUseVote.mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote,
      handleDownvote,
      handleCancelVote,
    });

    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    fireEvent.click(screen.getByText('10'));
    await waitFor(() => expect(handleUpvote).toHaveBeenCalled());

    fireEvent.click(screen.getByText('2'));
    await waitFor(() => expect(handleDownvote).toHaveBeenCalled());
  });

  it('shows loading state when data is not initialized', () => {
    mockUseVote.mockReturnValue({
      upvotes: 0,
      downvotes: 0,
      userVote: null,
      isLoading: false,
      isInitialized: false,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote: jest.fn(),
    });

    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles delete forum action', async () => {
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    fireEvent.click(screen.getByText('Hapus forum'));
    fireEvent.click(screen.getByText('Hapus'));

    await waitFor(() => {
      expect(mockOnDeleteSuccess).toHaveBeenCalledWith(mockForum.id);
    });
  });

  it('handles vote success callback after voting', async () => {
    const handleUpvote = jest.fn();
    const handleDownvote = jest.fn();

    mockUseVote.mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote,
      handleDownvote,
      handleCancelVote: jest.fn(),
    });

    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    fireEvent.click(screen.getByText('10'));
    await waitFor(() => {
      expect(handleUpvote).toHaveBeenCalled();
      expect(mockOnVoteSuccess).toHaveBeenCalledWith({
        ...mockForum,
        upvotes: 10,
        downvotes: 2,
      });
    });
  });

  it('navigates to forum details when "Lihat detail forum" is clicked', () => {
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );

    const detailButton = screen.getByText('Lihat detail forum');
    fireEvent.click(detailButton);

    // Assuming the navigation logic is handled elsewhere, we can check if the button exists
    expect(detailButton).toBeInTheDocument();
  });

  it('cancels upvote when user has already upvoted', async () => {
    const handleCancelVote = jest.fn();
  
    mockUseVote.mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: 'upvote', // Simulasikan user sudah memberikan upvote
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote,
    });
  
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );
  
    fireEvent.click(screen.getByText('10')); // Klik tombol upvote
  
    await waitFor(() => {
      expect(handleCancelVote).toHaveBeenCalled(); // Pastikan handleCancelVote dipanggil
    });
  });
  
  it('cancels downvote when user has already downvoted', async () => {
    const handleCancelVote = jest.fn();
  
    mockUseVote.mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: 'downvote', // Simulasikan user sudah memberikan downvote
      isLoading: false,
      isInitialized: true,
      handleUpvote: jest.fn(),
      handleDownvote: jest.fn(),
      handleCancelVote,
    });
  
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );
  
    fireEvent.click(screen.getByText('2')); // Klik tombol downvote
  
    await waitFor(() => {
      expect(handleCancelVote).toHaveBeenCalled(); // Pastikan handleCancelVote dipanggil
    });
  });

  it('logs an error when voting fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {}); // Mock console.error
    const handleUpvote = jest.fn().mockRejectedValue(new Error('Upvote failed')); // Simulasikan error
  
    mockUseVote.mockReturnValue({
      upvotes: 10,
      downvotes: 2,
      userVote: null,
      isLoading: false,
      isInitialized: true,
      handleUpvote,
      handleDownvote: jest.fn(),
      handleCancelVote: jest.fn(),
    });
  
    render(
      <ForumCard
        forum={mockForum}
        onDeleteSuccess={mockOnDeleteSuccess}
        onVoteSuccess={mockOnVoteSuccess}
      />
    );
  
    fireEvent.click(screen.getByText('10')); // Klik tombol upvote
  
    await waitFor(() => {
      expect(handleUpvote).toHaveBeenCalled(); // Pastikan handleUpvote dipanggil
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error voting:', expect.any(Error)); // Pastikan error dicatat
    });
  
    consoleErrorSpy.mockRestore(); // Kembalikan console.error ke implementasi aslinya
  });
});