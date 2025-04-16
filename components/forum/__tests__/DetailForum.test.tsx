import React from 'react';
import { render, screen } from '@testing-library/react';
import DetailForum from '@/components/forum/DetailForum';

describe('DetailForum Component', () => {
  const mockForum = {
    id: 1,
    description: 'Ini adalah deskripsi forum.',
    timestamp: '2024-04-08',
    user: {
      first_name: 'Tambak',
      last_name: 'Lele',
      email: 'tambaklele@gmail.com',
    },
  };

  test('renders all forum details correctly', () => {
    render(<DetailForum forum={mockForum} />);

    expect(screen.getByText(/Detail Forum/i)).toBeInTheDocument();
    expect(screen.getByText(/Username:/i)).toHaveTextContent('Username: Tambak Lele');
    expect(screen.getByText(/Email:/i)).toHaveTextContent('Email: tambaklele@gmail.com');

    const formattedDate = new Date(mockForum.timestamp).toLocaleDateString();
    expect(screen.getByText(/Tanggal Pembuatan:/i)).toHaveTextContent(`Tanggal Pembuatan: ${formattedDate}`);

    const formattedTime = new Date(mockForum.timestamp).toLocaleTimeString();
    expect(screen.getByText(/Jam Pembuatan:/i)).toHaveTextContent(`Jam Pembuatan: ${formattedTime}`);

    expect(screen.getByText(/Deskripsi Forum:/i)).toBeInTheDocument();
    expect(screen.getByText(mockForum.description)).toBeInTheDocument();
  });
});