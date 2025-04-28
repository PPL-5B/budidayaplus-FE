import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddReply from '@/components/forum/AddReply';
import '@testing-library/jest-dom';

// Mock ReplyForm
jest.mock('@/components/forum/ReplyForm', () => {
  return function MockReplyForm({ setIsModalOpen, onReplyAdded }: any) {
    return (
      <div>
        <p>Reply Form</p>
        <button onClick={() => {
          setIsModalOpen(false);
          if (onReplyAdded) onReplyAdded();
        }}>
          Submit Mock
        </button>
      </div>
    );
  };
});

describe('AddReply', () => {
  const mockOnReplyAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Add Reply button', () => {
    render(<AddReply parentForumId="forum123" />);
    expect(screen.getByRole('button', { name: /add reply/i })).toBeInTheDocument();
  });

  it('opens modal when Add Reply button is clicked', async () => {
    render(<AddReply parentForumId="forum123" />);

    // Modal belum muncul
    expect(screen.queryByText(/reply form/i)).not.toBeInTheDocument();

    // Klik tombol
    fireEvent.click(screen.getByRole('button', { name: /add reply/i }));

    // Modal muncul
    expect(await screen.findByText(/reply form/i)).toBeInTheDocument();
  });

  it('calls onReplyAdded after submitting ReplyForm', async () => {
    render(<AddReply parentForumId="forum123" onReplyAdded={mockOnReplyAdded} />);

    fireEvent.click(screen.getByRole('button', { name: /add reply/i }));

    const submitButton = await screen.findByRole('button', { name: /submit mock/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnReplyAdded).toHaveBeenCalled();
    });
  });
});
