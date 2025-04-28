import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DetailForum from '@/components/forum/DetailForum';
import { useRouter } from 'next/navigation';
import '@testing-library/jest-dom';

// Mock router
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('DetailForum Component', () => {
  const mockPush = jest.fn();

  const mockForum = {
    id: '1',
    description: 'Ini adalah deskripsi forum.',
    timestamp: '2024-04-08T10:30:00.000Z',
    user: {
      first_name: 'Tambak',
      last_name: 'Lele',
      phone_number: '08123456789',
    },
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({
      push: mockPush,
    });
    jest.clearAllMocks();
  });

  it('renders all forum details correctly', () => {
    render(<DetailForum forum={mockForum} />);

    // Username (gabungan first_name + last_name)
    expect(screen.getByText(/username:/i)).toHaveTextContent(`Username: ${mockForum.user.first_name} ${mockForum.user.last_name}`);

    // Tanggal
    const formattedDate = new Date(mockForum.timestamp).toLocaleDateString();
    expect(screen.getByText(/tanggal pembuatan:/i)).toHaveTextContent(`Tanggal Pembuatan: ${formattedDate}`);

    // Jam
    const formattedTime = new Date(mockForum.timestamp).toLocaleTimeString();
    expect(screen.getByText(/jam pembuatan:/i)).toHaveTextContent(`Jam Pembuatan: ${formattedTime}`);

    // Deskripsi forum
    expect(screen.getByText(/deskripsi forum:/i)).toBeInTheDocument();
    expect(screen.getByText(mockForum.description)).toBeInTheDocument();

    // Bubble inisial user
    expect(screen.getByText(mockForum.user.first_name.charAt(0))).toBeInTheDocument();
  });

  it('navigates back to forum when "Kembali ke Forum" button is clicked', () => {
    render(<DetailForum forum={mockForum} />);

    const backButton = screen.getByRole('button', { name: /kembali ke forum/i });
    fireEvent.click(backButton);

    expect(mockPush).toHaveBeenCalledWith('/forum');
  });
});
