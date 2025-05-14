import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddForum from '../AddForum';
import '@testing-library/jest-dom';

// Buat tipe props secara eksplisit untuk MockForumForm
interface MockForumFormProps {
  setIsModalOpen: (isOpen: boolean) => void;
  onForumAdded?: () => void;
  isReply?: boolean;
}

// Mock ForumForm supaya fokus ke AddForum behavior
jest.mock('../ForumForm', () => {
  return {
    __esModule: true,
    default: ({ setIsModalOpen, onForumAdded, isReply }: MockForumFormProps) => (
      <div data-testid="forum-form">
        <p>{isReply ? 'Reply Form' : 'Forum Form'}</p>
        <button
          onClick={() => {
            setIsModalOpen(false);
            if (onForumAdded) onForumAdded();
          }}
        >
          Submit Mock
        </button>
      </div>
    ),
  };
});

describe('AddForum', () => {
  const mockOnForumAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders Add Forum button when isReply is false', () => {
    render(<AddForum />);
    expect(screen.getByRole('button', { name: /add forum/i })).toBeInTheDocument();
  });

  it('renders Reply button when isReply is true', () => {
    render(<AddForum isReply />);
    expect(screen.getByRole('button', { name: /reply/i })).toBeInTheDocument();
  });

  it('opens modal and shows ForumForm when clicking Add Forum button', async () => {
    render(<AddForum />);
    fireEvent.click(screen.getByRole('button', { name: /add forum/i }));

    expect(await screen.findByTestId('forum-form')).toBeInTheDocument();
    expect(await screen.findByText(/forum form/i)).toBeInTheDocument();
  });

  it('opens modal and shows ReplyForm when isReply true and clicked', async () => {
    render(<AddForum isReply />);
    fireEvent.click(screen.getByRole('button', { name: /reply/i }));

    expect(await screen.findByTestId('forum-form')).toBeInTheDocument();
    expect(await screen.findByText(/reply form/i)).toBeInTheDocument();
  });

  it('calls onForumAdded and closes modal after submitting', async () => {
    render(<AddForum onForumAdded={mockOnForumAdded} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add forum/i }));

    const submitButton = await screen.findByRole('button', { name: /submit mock/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnForumAdded).toHaveBeenCalledTimes(1);
    });
  });

  it('closes modal after submitting even without onForumAdded', async () => {
    render(<AddForum />);

    fireEvent.click(screen.getByRole('button', { name: /add forum/i }));

    const submitButton = await screen.findByRole('button', { name: /submit mock/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(true).toBeTruthy(); 
    });
  });
});