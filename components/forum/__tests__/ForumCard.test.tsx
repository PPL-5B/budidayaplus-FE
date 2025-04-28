import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumCard from '../ForumCard';
import { Forum } from '@/types/forum';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

// Mock DeleteForumContainer supaya tidak crash
jest.mock('../DeleteForumContainer', () => ({
  __esModule: true,
  default: function MockDeleteForumContainer({ forumId, isOpen, onClose, onSuccess }: any) {
    React.useEffect(() => {
      if (isOpen) {
        onSuccess();
        onClose();
      }
    }, [isOpen, onSuccess, onClose]);

    return <div data-testid="mock-delete-container" />;
  },
}));

describe('ForumCard', () => {
  const mockPush = jest.fn();
  const forumMock: Forum = {
    id: '1',
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
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders forum card properly', () => {
    render(<ForumCard forum={forumMock} />);

    expect(screen.getByText(/Jane/)).toBeInTheDocument();
    expect(screen.getByText(/Lihat Unggahan/)).toBeInTheDocument();
    expect(screen.getByText(forumMock.description)).toBeInTheDocument();
  });

  it('navigates to forum details when "Lihat Unggahan" is clicked', () => {
    render(<ForumCard forum={forumMock} />);
    fireEvent.click(screen.getByText('Lihat Unggahan'));

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'selectedForum',
      JSON.stringify(forumMock)
    );
    expect(mockPush).toHaveBeenCalledWith('/forum/1');
  });

  it('allows editing the forum description and saving changes', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });

    fireEvent.click(screen.getByText('Simpan'));

    expect(screen.getByText('Updated description')).toBeInTheDocument();
  });

  it('cancels editing and restores the original description', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Discard this' } });

    fireEvent.click(screen.getByText('Batal'));

    expect(screen.getByText(forumMock.description)).toBeInTheDocument();
  });

  it('opens the delete modal when "Hapus" is clicked', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Hapus'));

    expect(screen.getByTestId('mock-delete-container')).toBeInTheDocument();
  });

  it('calls onDeleteSuccess when delete is confirmed', () => {
    const mockOnDeleteSuccess = jest.fn();

    render(<ForumCard forum={forumMock} onDeleteSuccess={mockOnDeleteSuccess} />);

    fireEvent.click(screen.getByText('Hapus'));

    expect(screen.getByTestId('mock-delete-container')).toBeInTheDocument();
    expect(mockOnDeleteSuccess).toHaveBeenCalledWith('1');
  });
});
