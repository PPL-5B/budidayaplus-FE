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
    const expectedDate = new Date('2025-04-07T12:00:00Z').toLocaleString('id-ID', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
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

  it('should allow editing description and save it', () => {
    render(<ForumCard forum={mockForum} />);
  
    // Klik tombol edit
    fireEvent.click(screen.getByText('Edit deskripsi'));
  
    // Pastikan textarea muncul
    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();
  
    // Ubah deskripsi
    fireEvent.change(textarea, { target: { value: 'Updated description' } });
  
    // Klik tombol simpan
    fireEvent.click(screen.getByText('Simpan'));
  
    // Pastikan deskripsi baru muncul
    expect(screen.getByText('Updated description')).toBeInTheDocument();
  
    // Pastikan tombol "Edit deskripsi" muncul lagi (berarti form edit hilang)
    expect(screen.getByText('Edit deskripsi')).toBeInTheDocument();
  });
  
  it('should discard changes when cancel is clicked', () => {
    render(<ForumCard forum={mockForum} />);
  
    // Klik tombol edit
    fireEvent.click(screen.getByText('Edit deskripsi'));
  
    // Ubah deskripsi
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'Ini tidak akan disimpan' } });
  
    // Klik tombol batal
    fireEvent.click(screen.getByText('Batal'));
  
    // Pastikan deskripsi kembali ke yang awal
    expect(screen.getByText(mockForum.description)).toBeInTheDocument();
  
    // Pastikan textarea tidak muncul lagi
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });  
});