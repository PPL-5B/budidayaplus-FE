import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReplyForm from '@/components/forum/ReplyForm';
import '@testing-library/jest-dom';

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

    const submitButton = screen.getByRole('button', { name: /submit reply/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/description is required/i)).toBeInTheDocument();
  });

  it('submits form successfully with valid data', async () => {
    (createReply as jest.Mock).mockResolvedValueOnce({});

    render(
      <ReplyForm
        setIsModalOpen={mockSetIsModalOpen}
        parentForumId="forum123"
        onReplyAdded={mockOnReplyAdded}
      />
    );

    const descriptionTextarea = screen.getByPlaceholderText(/enter your reply/i);
    const submitButton = screen.getByRole('button', { name: /submit reply/i });

    await userEvent.type(descriptionTextarea, 'This is a reply');
    await userEvent.click(submitButton);

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
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (createReply as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    render(<ReplyForm setIsModalOpen={mockSetIsModalOpen} parentForumId="forum123" />);

    const descriptionTextarea = screen.getByPlaceholderText(/enter your reply/i);
    const submitButton = screen.getByRole('button', { name: /submit reply/i });

    await userEvent.type(descriptionTextarea, 'Another reply');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(createReply).toHaveBeenCalledWith({
        description: 'Another reply',
        parent_id: 'forum123',
      });
      expect(mockSetIsModalOpen).not.toHaveBeenCalled(); // Modal tidak ditutup kalau gagal
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating reply:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });
});
