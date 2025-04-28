import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumCardFooter from '../ForumCardFooter';

describe('ForumCardFooter', () => {
  const mockOnViewDetails = jest.fn();
  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();

  const baseProps = {
    onViewDetails: mockOnViewDetails,
    onEdit: mockOnEdit,
    onDelete: mockOnDelete,
    userInitial: 'J',
    tag: 'ikan',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders tag, user initial, and Lihat Unggahan button', () => {
    render(<ForumCardFooter {...baseProps} isEditing={false} />);

    expect(screen.getByText('ikan')).toBeInTheDocument();
    expect(screen.getByText('J')).toBeInTheDocument();
    expect(screen.getByText('Lihat Unggahan')).toBeInTheDocument();
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
});
