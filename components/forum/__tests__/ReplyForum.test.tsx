import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReplyForm from '@/components/forum/ReplyForm';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock createReply API
jest.mock('@/lib/forum/createReply', () => ({
  createReply: jest.fn(),
}));

import { createReply } from '@/lib/forum/createReply';

describe('ReplyForm', () => {
  const mockSetIsModalOpen = jest.fn();
  const mockOnReplyAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders description input and submit button', () => {
    render(<ReplyForm setIsModalOpen={mockSetIsModalOpen} parentForumId="forum123" />);

    expect(screen.getByPlaceholderText(/enter your reply/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit reply/i })).toBeInTheDocument();
  });

  it('shows validation error when description is empty', async () => {
    render(<ReplyForm setIsModalOpen={mockSetIsModalOpen} parentForumId="forum123" />);

    fireEvent.click(screen.getByRole('button', { name: /submit reply/i }));

    await waitFor(() => {
      expect(screen.getByText(/description is required/i)).toBeInTheDocument();
    });
  });

  it('submits form successfully with valid data', async () => {
    (createReply as jest.Mock).mockResolvedValueOnce({});

    render(<ReplyForm setIsModalOpen={mockSetIsModalOpen} parentForumId="forum123" onReplyAdded={mockOnReplyAdded} />);

    const descriptionTextarea = screen.getByPlaceholderText(/enter your reply/i);
    const submitButton = screen.getByRole('button', { name: /submit reply/i });

    await userEvent.type(descriptionTextarea, 'This is a reply');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createReply).toHaveBeenCalledWith({
        description: 'This is a reply',
        parent_id: 'forum123',
      });
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockOnReplyAdded).toHaveBeenCalled();
    });
  });

  it('handles error when createReply fails', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (createReply as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    render(<ReplyForm setIsModalOpen={mockSetIsModalOpen} parentForumId="forum123" />);

    const descriptionTextarea = screen.getByPlaceholderText(/enter your reply/i);
    const submitButton = screen.getByRole('button', { name: /submit reply/i });

    await userEvent.type(descriptionTextarea, 'Another reply');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createReply).toHaveBeenCalled();
      expect(mockSetIsModalOpen).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith('Error creating reply:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });
});
