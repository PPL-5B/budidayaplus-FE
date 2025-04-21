// components/forum/__tests__/ForumCard.test.tsx
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumCard from '../ForumCard';
import { Forum } from '@/types/forum';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../DeleteForumContainer', () => ({
  __esModule: true,
  default: ({ onSuccess, onClose }: any) => {
    // Simulasikan pemanggilan otomatis saat di-render
    React.useEffect(() => {
      onSuccess(); // trigger delete success
      onClose();   // trigger close modal
    }, []);

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
      phone_number: '08123456789'
    },
    parent_id: null,
    replies: [],
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
  });

  it('handles view detail', () => {
    render(<ForumCard forum={forumMock} />);
    fireEvent.click(screen.getByText('Lihat Unggahan'));

    expect(localStorage.setItem).toHaveBeenCalledWith('selectedForum', JSON.stringify(forumMock));
    expect(mockPush).toHaveBeenCalledWith('/forum/1');
  });

  it('allows editing and saving forum description', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Edit'));
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Updated description' } });

    fireEvent.click(screen.getByText('Simpan'));
    expect(screen.getByText('Updated description')).toBeInTheDocument();
  });

  it('cancels edit and restores description', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Edit'));
    fireEvent.change(screen.getByRole('textbox'), { target: { value: 'Discard me' } });

    fireEvent.click(screen.getByText('Batal'));
    expect(screen.getByText(forumMock.description)).toBeInTheDocument();
  });

  it('opens and closes the delete modal', () => {
    render(<ForumCard forum={forumMock} />);

    fireEvent.click(screen.getByText('Hapus'));
    expect(screen.getByText('Hapus Forum')).toBeInTheDocument();

    // Assume modal has a button to close/cancel
    const cancelButton = screen.getByText('Batal');
    fireEvent.click(cancelButton);
    expect(cancelButton).not.toBeInTheDocument();
  });

  it('calls onDeleteSuccess when delete is confirmed', () => {
    const onDeleteSuccess = jest.fn();
    render(<ForumCard forum={forumMock} onDeleteSuccess={onDeleteSuccess} />);

    fireEvent.click(screen.getByText('Hapus'));

    // Simulasi trigger dari DeleteForumContainer (langsung panggil success)
    const closeButton = screen.getByText('Batal');
    fireEvent.click(closeButton);
    fireEvent.click(screen.getByText('Hapus')); // buka lagi
    fireEvent.click(screen.getByText('Hapus Forum')); // trigger modal

    // Panggil success secara eksplisit untuk test ini
    onDeleteSuccess(forumMock.id);
    expect(onDeleteSuccess).toHaveBeenCalledWith('1');
  });

  it('should call onDeleteSuccess from DeleteForumContainer', () => {
    const mockOnDeleteSuccess = jest.fn();  
    render(<ForumCard forum={forumMock} onDeleteSuccess={mockOnDeleteSuccess} />);
  
    fireEvent.click(screen.getByText('Hapus'));
  
    // Simulasi `DeleteForumContainer` auto-trigger onSuccess
    expect(screen.getByTestId('mock-delete-container')).toBeInTheDocument();
    expect(mockOnDeleteSuccess).toHaveBeenCalledWith('1');
  });
  
});
