import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ForumCardFooter from '../ForumCardFooter';

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
    tag: 'ikan',
    upvotes: 10,
    userVote: null,
    isLoading: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tag, upvote button, and detail link', () => {
    render(<ForumCardFooter isOwner={true} {...baseProps} isEditing={false} />);
    expect(screen.getByText('ikan')).toBeInTheDocument();
    expect(screen.getByText('Lihat Detail Forum')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
  });

  it('triggers onViewDetails when clicked', () => {
    render(<ForumCardFooter isOwner={true} {...baseProps} isEditing={false} />);
    fireEvent.click(screen.getByText('Lihat Detail Forum'));
    expect(mockOnViewDetails).toHaveBeenCalled();
  });

  it('triggers onEdit and onDelete', () => {
    render(<ForumCardFooter isOwner={true} {...baseProps} isEditing={false} />);
    fireEvent.click(screen.getByText('Ubah'));
    fireEvent.click(screen.getByText('Hapus'));
    expect(mockOnEdit).toHaveBeenCalled();
    expect(mockOnDelete).toHaveBeenCalled();
  });

  it('does not show edit/hapus when not owner', () => {
    render(<ForumCardFooter isOwner={false} {...baseProps} isEditing={false} />);
    expect(screen.queryByText('Ubah')).not.toBeInTheDocument();
    expect(screen.queryByText('Hapus')).not.toBeInTheDocument();
  });

  it('does not show edit/hapus when editing', () => {
    render(<ForumCardFooter isOwner={true} {...baseProps} isEditing={true} />);
    expect(screen.queryByText('Ubah')).not.toBeInTheDocument();
    expect(screen.queryByText('Hapus')).not.toBeInTheDocument();
  });

  it('calls handleVote when upvote clicked', () => {
    render(<ForumCardFooter isOwner={false} {...baseProps} isEditing={false} />);
    fireEvent.click(screen.getByText('10'));
    expect(mockHandleVote).toHaveBeenCalledWith('upvote');
  });

  it('disables upvote button when loading', () => {
    render(<ForumCardFooter isOwner={false} {...baseProps} isLoading={true} isEditing={false} />);
    expect(screen.getByRole('button', { name: /10/i })).toBeDisabled();
  });

  it('renders green style when user has upvoted', () => {
    render(<ForumCardFooter isOwner={false} {...baseProps} userVote="upvote" isEditing={false} />);
    const button = screen.getByRole('button', { name: /10/i });
    expect(button).toHaveClass('bg-green-100');
    expect(button).toHaveClass('text-green-600');
  });
});
