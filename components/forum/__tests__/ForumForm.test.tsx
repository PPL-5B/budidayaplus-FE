import React from 'react';
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

  it('renders textarea and submit button', () => {
    render(
      <ForumForm setIsModalOpen={mockSetIsModalOpen} />
    );
    expect(screen.getByPlaceholderText(/enter forum description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation error when submitted with empty description', async () => {
    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getByText(/required/i)).toBeInTheDocument();
    });
  });

  it('submits valid data and closes modal + calls onForumAdded', async () => {
    (createForum as jest.Mock).mockResolvedValueOnce({});

    render(
      <ForumForm
        setIsModalOpen={mockSetIsModalOpen}
        onForumAdded={mockOnForumAdded}
        parentForumId="parent123"
      />
    );

    const textarea = screen.getByPlaceholderText(/enter forum description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(textarea, 'This is a test forum');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalledWith({
        description: 'This is a test forum',
        parent_id: 'parent123',
      });

      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockOnForumAdded).toHaveBeenCalled();
    });
  });

  it('handles error from createForum', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (createForum as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    const textarea = screen.getByPlaceholderText(/enter forum description/i);
    await userEvent.type(textarea, 'Another test forum');
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(createForum).toHaveBeenCalled();
      expect(mockSetIsModalOpen).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating forum:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });
});