import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumCard from '../ForumCard';
import { Forum } from '@/types/forum';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Define mock props for DeleteForumContainer
interface MockDeleteForumContainerProps {
  forumId: string;
  forumTitle: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Mock DeleteForumContainer
jest.mock('../DeleteForumContainer', () => ({
  __esModule: true,
  default: function MockDeleteForumContainer({ forumId, isOpen, onClose, onSuccess }: MockDeleteForumContainerProps) {
    React.useEffect(() => {
      if (isOpen) {
        onSuccess();
        onClose();
      }
    }, [isOpen, onClose, onSuccess]);
    return <div data-testid="mock-delete-container" />;
  },
}));

describe('ForumCard', () => {
  const mockPush = jest.fn();

  const forumMock: Forum = {
    id: '1',
    title: 'Judul Forum Test',
    description: 'Example forum content for test.',
    timestamp: new Date('2025-04-21T10:00:00Z'),
    user: {
      id: 99,
      first_name: 'Jane',
      last_name: 'Doe',
      phone_number: '08123456789',
    },
    parent_id: null,
    replies: [],
    tag: 'ikan',
    upvotes: 10,
    downvotes: 2,
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    Storage.prototype.setItem = jest.fn();
    jest.clearAllMocks();
  });

  it('renders forum card correctly', () => {
    render(<ForumCard forum={forumMock} />);

    expect(screen.getByText(/Jane/)).toBeInTheDocument();
    expect(screen.getByText(/Lihat Unggahan/)).toBeInTheDocument();
    expect(screen.getByText(forumMock.description)).toBeInTheDocument();
  });

  it('navigates to forum detail when "Lihat Unggahan" is clicked', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByRole('button', { name: /lihat unggahan/i }));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'selectedForum',
      JSON.stringify(forumMock)
    );
    expect(mockPush).toHaveBeenCalledWith('/forum/1');
  });

  it('allows editing forum description and saving it', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });

    fireEvent.click(screen.getByRole('button', { name: /simpan/i }));

    expect(screen.getByText('Updated description')).toBeInTheDocument();
  });

  it('cancels editing and restores original description', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByRole('button', { name: /edit/i }));

    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Temporary edit' } });

    fireEvent.click(screen.getByRole('button', { name: /batal/i }));

    expect(screen.getByText(forumMock.description)).toBeInTheDocument();
  });

  it('opens delete modal when "Hapus" is clicked', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    expect(screen.getByTestId('mock-delete-container')).toBeInTheDocument();
  });

  it('calls onDeleteSuccess when delete confirmed', () => {
    const mockOnDeleteSuccess = jest.fn();

    render(<ForumCard forum={forumMock} onDeleteSuccess={mockOnDeleteSuccess} />);

    fireEvent.click(screen.getByRole('button', { name: /hapus/i }));

    expect(screen.getByTestId('mock-delete-container')).toBeInTheDocument();
    expect(mockOnDeleteSuccess).toHaveBeenCalledWith('1');
  });
});
