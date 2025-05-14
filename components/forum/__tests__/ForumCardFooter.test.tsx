import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumCardFooter from '../ForumCardFooter';
import '@testing-library/jest-dom';

describe('ForumCardFooter', () => {
  const mockOnViewDetails = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockHandleVote = jest.fn();

  const baseProps = {
    onViewDetails: mockOnViewDetails,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    handleVote: mockHandleVote,
    userInitial: 'J',
    tag: 'ikan',
    upvotes: 10,
    downvotes: 2,
    userVote: null,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tag, user initial, Lihat Unggahan button, and votes', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    expect(screen.getByText('ikan')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('Lihat Unggahan')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument(); // Upvotes
    expect(screen.getByText('2')).toBeInTheDocument(); // Downvotes
  });

  it('calls onViewDetails when "Lihat Unggahan" button is clicked', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getByText('Lihat Unggahan'));
    expect(mockOnViewDetails).toHaveBeenCalled();
  });

  it('renders Edit and Hapus buttons when not editing', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    expect(screen.getByText('Edit')).toBeInTheDocument();
    expect(screen.getByText('Hapus')).toBeInTheDocument();
  });

  it('calls onEdit when "Edit" button is clicked', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getByText('Edit'));
    expect(mockOnEdit).toHaveBeenCalled();
  });

  it('calls onDelete when "Hapus" button is clicked', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    fireEvent.click(screen.getByText('Hapus'));
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('does not render Edit and Hapus buttons when isEditing is true', () => {
    render(<ForumCardFooter {...baseProps} isEditing={true} />);

    expect(screen.queryByText('Edit')).toBeNull();
    expect(screen.queryByText('Hapus')).toBeNull();
  });

  it('calls handleVote with "upvote" when upvote button is clicked', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    const upvoteButton = screen.getByRole('button', { name: /10/i });
    fireEvent.click(upvoteButton);
    expect(mockHandleVote).toHaveBeenCalledWith('upvote');
  });

  it('calls handleVote with "downvote" when downvote button is clicked', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    const downvoteButton = screen.getByRole('button', { name: /2/i });
    fireEvent.click(downvoteButton);
    expect(mockHandleVote).toHaveBeenCalledWith('downvote');
  });

  it('disables voting buttons when isLoading is true', () => {
    render(<ForumCardFooter {...baseProps} isLoading={true} isEditing={false} />);

    const upvoteButton = screen.getByRole('button', { name: /10/i });
    const downvoteButton = screen.getByRole('button', { name: /2/i });

    expect(upvoteButton).toBeDisabled();
    expect(downvoteButton).toBeDisabled();
  });

  // ====== Tambahan untuk cover branch userVote ======

  it('renders upvote button with green color when userVote is "upvote"', () => {
    render(<ForumCardFooter {...baseProps} userVote="upvote" isEditing={false} />);

    const upvoteButton = screen.getByRole('button', { name: /10/i });
    expect(upvoteButton).toHaveClass('bg-green-100', { exact: false });
    expect(upvoteButton).toHaveClass('text-green-600', { exact: false });
  });

  it('renders downvote button with red color when userVote is "downvote"', () => {
    render(<ForumCardFooter {...baseProps} userVote="downvote" isEditing={false} />);

    const downvoteButton = screen.getByRole('button', { name: /2/i });
    expect(downvoteButton).toHaveClass('bg-red-100', { exact: false });
    expect(downvoteButton).toHaveClass('text-red-600', { exact: false });
  });
});
