import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import ForumForm from '@/components/forum/ForumForm';
import { createForum } from '@/lib/forum/createForum';

// Mock createForum supaya tidak benar-benar call API
jest.mock('@/lib/forum/createForum', () => ({
  createForum: jest.fn(() => Promise.resolve()),
}));

describe('ForumForm', () => {
  const mockSetIsModalOpen = jest.fn();
  const mockOnForumAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders all fields correctly for new forum', () => {
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} />
    );

    expect(screen.getByLabelText(/judul/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/deskripsi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('does not render title field if isReply is true', () => {
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} isReply />
    );

    expect(screen.queryByLabelText(/judul/i)).not.toBeInTheDocument();
    expect(screen.getByLabelText(/deskripsi/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
  });

  it('submits the form successfully', async () => {
    const user = userEvent.setup();
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} />
    );

    await user.type(screen.getByLabelText(/judul/i), 'Judul Forum Test');
    await user.type(screen.getByLabelText(/deskripsi/i), 'Ini deskripsi forum test.');
    await user.selectOptions(screen.getByLabelText(/tag/i), 'siklus');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockOnForumAdded).toHaveBeenCalledTimes(1);
    });
  });

  it('shows validation errors when required fields are missing', async () => {
    const user = userEvent.setup();
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} />
    );

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    // Override mock supaya createForum gagal
    (createForum as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    const user = userEvent.setup();
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} />
    );

    await user.type(screen.getByLabelText(/judul/i), 'Forum Error Test');
    await user.type(screen.getByLabelText(/deskripsi/i), 'Deskripsi error');
    await user.selectOptions(screen.getByLabelText(/tag/i), 'ikan');

    await user.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(mockSetIsModalOpen).not.toHaveBeenCalled();
      expect(mockOnForumAdded).not.toHaveBeenCalled();
    });
  });
});
