import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForumForm from '@/components/forum/ForumForm';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock createForum API
jest.mock('@/lib/forum/createForum', () => ({
  createForum: jest.fn(),
}));

import { createForum } from '@/lib/forum/createForum';

describe('ForumForm', () => {
  const mockSetIsModalOpen = jest.fn();
  const mockOnForumAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title, description, tag options, and submit button', () => {
    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByPlaceholderText(/enter forum title/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/enter forum description/i)).toBeInTheDocument();
    expect(screen.getByText('Ikan')).toBeInTheDocument();
    expect(screen.getByText('Kolam')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation error when description is empty', async () => {
    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    (createForum as jest.Mock).mockResolvedValueOnce({});

    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} onForumAdded={mockOnForumAdded} />);

    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'Test Forum Title');
    await userEvent.type(descriptionTextarea, 'Test description content');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalledWith({
        title: 'Test Forum Title',
        description: 'Test description content',
        tag: 'ikan',
        parent_id: null,
      });
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockOnForumAdded).toHaveBeenCalled();
    });
  });

  it('changes tag when clicking different tag button', async () => {
    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    const kolamButton = screen.getByRole('button', { name: /kolam/i });

    fireEvent.click(kolamButton);

    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);
    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'Forum Kolam');
    await userEvent.type(descriptionTextarea, 'Kolam description');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalledWith({
        title: 'Forum Kolam',
        description: 'Kolam description',
        tag: 'kolam', // tag harus berubah!
        parent_id: null,
      });
    });
  });

  it('handles error when createForum fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (createForum as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'Error Forum');
    await userEvent.type(descriptionTextarea, 'This should fail');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalled();
      expect(mockSetIsModalOpen).not.toHaveBeenCalled(); // Tidak tutup modal
      expect(consoleSpy).toHaveBeenCalledWith('Error creating forum:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
