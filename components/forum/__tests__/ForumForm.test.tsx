import { render, screen, waitFor } from '@testing-library/react';
import ForumForm from '@/components/forum/ForumForm';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';

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

    // Judul
    expect(screen.getByLabelText(/judul/i)).toBeInTheDocument();
    // Deskripsi
    expect(screen.getByLabelText(/deskripsi/i)).toBeInTheDocument();
    // Tag
    expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
    // Submit
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('does not render title field if isReply is true', () => {
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} isReply />
    );

    // Title tidak ada
    expect(screen.queryByLabelText(/judul/i)).not.toBeInTheDocument();
    // Deskripsi tetap ada
    expect(screen.getByLabelText(/deskripsi/i)).toBeInTheDocument();
    // Tag tetap ada
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

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

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

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      // Karena tidak mengisi apa-apa, error muncul
      expect(screen.getByText(/title is required/i)).toBeInTheDocument();
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('handles API error gracefully', async () => {
    // Ubah mock createForum supaya throw error
    const { createForum } = require('@/lib/forum/createForum');
    createForum.mockRejectedValueOnce(new Error('API Error'));

    const user = userEvent.setup();
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} />
    );

    await user.type(screen.getByLabelText(/judul/i), 'Forum Error Test');
    await user.type(screen.getByLabelText(/deskripsi/i), 'Deskripsi error');
    await user.selectOptions(screen.getByLabelText(/tag/i), 'ikan');

    const submitButton = screen.getByRole('button', { name: /submit/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(mockSetIsModalOpen).not.toHaveBeenCalled(); // Modal tidak langsung tutup
      expect(mockOnForumAdded).not.toHaveBeenCalled(); // Tidak panggil kalau gagal
    });
  });
});
