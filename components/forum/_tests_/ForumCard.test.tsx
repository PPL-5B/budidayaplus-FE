import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ForumCard from '@/components/forum/ForumCard';
import { useRouter } from 'next/navigation';
import { Forum } from '@/types/forum';

// Mock useRouter
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

describe('ForumCard', () => {
  const mockPush = jest.fn();
  const mockForum: Forum = {
    id: '1',
    user: {
        first_name: 'John',
        last_name: 'Doe',
        id: 0,
        phone_number: '08123456789'
    },
    description: 'This is a test forum description.',
    timestamp: new Date('2025-04-07T12:00:00Z'),
    parent_id: null,
    replies: [],
  };

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should render forum details correctly', () => {
    render(<ForumCard forum={mockForum} />);
    
    // Check if user name is rendered
    expect(screen.getByText('Dibuat oleh: John Doe')).toBeInTheDocument();
    
    // Instead of checking for exact date text, use a more flexible approach
    const expectedDate = new Date('2025-04-07T12:00:00Z').toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
    
    expect(screen.getByText(`Tanggal: ${expectedDate}`)).toBeInTheDocument();
    
    // Check if description is rendered
    expect(screen.getByText('This is a test forum description.')).toBeInTheDocument();
  });

  it('should call router.push when "Lihat detail forum" button is clicked', () => {
    render(<ForumCard forum={mockForum} />);
    // Click the "Lihat detail forum" button
    const button = screen.getByText('Lihat detail forum');
    fireEvent.click(button);
    // Check if router.push is called with the correct URL
    expect(mockPush).toHaveBeenCalledWith('/forum/1');
  });

  it('should call router.push when ChevronRight icon is clicked', () => {
    render(<ForumCard forum={mockForum} />);
    // Click the ChevronRight icon
    const chevron = screen.getByLabelText('Navigate to forum');
    fireEvent.click(chevron);
    // Check if router.push is called with the correct URL
    expect(mockPush).toHaveBeenCalledWith('/forum/1');
  });
});