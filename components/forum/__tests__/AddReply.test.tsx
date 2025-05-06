import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddReply from '@/components/forum/AddReply';
import '@testing-library/jest-dom';

// Buat interface props untuk MockReplyForm
interface MockReplyFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onReplyAdded?: () => void;
}


jest.mock('@/components/forum/ReplyForm', () => {
  return {
    __esModule: true,
    default: ({ setIsModalOpen, onReplyAdded }: MockReplyFormProps) => {
      return (
        <div data-testid="reply-form">
          <p>Reply Form</p>
          <button onClick={() => {
            setIsModalOpen(false);
            if (onReplyAdded) onReplyAdded();
          }}>
            Submit Mock
          </button>
        </div>
      );
    }
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

    expect(screen.queryByTestId('reply-form')).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /add reply/i }));

    expect(await screen.findByTestId('reply-form')).toBeInTheDocument();
    expect(await screen.findByText(/reply form/i)).toBeInTheDocument();
  });

  it('calls onReplyAdded after submitting ReplyForm', async () => {
    render(<AddReply parentForumId="forum123" onReplyAdded={mockOnReplyAdded} />);

    fireEvent.click(screen.getByRole('button', { name: /add reply/i }));

    const submitButton = await screen.findByRole('button', { name: /submit mock/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnReplyAdded).toHaveBeenCalledTimes(1);
    });
  });
});
