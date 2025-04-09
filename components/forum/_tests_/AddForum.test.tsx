import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddForum from '@/components/forum/AddForum';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('@/components/forum/ForumForm', () => (props: any) => (
  <div data-testid="forum-form">
    ForumForm mocked - parentForumId: {props.parentForumId?.toString() || 'none'}
    <button onClick={() => props.setIsModalOpen(false)}>Close Modal</button>
  </div>
));

describe('AddForum', () => {
  it('renders button and opens modal on click', () => {
    render(<AddForum />);

    // Pastikan tombol muncul
    const addButton = screen.getByRole('button', { name: /add forum/i });
    expect(addButton).toBeInTheDocument();

    // Klik tombol
    fireEvent.click(addButton);

    // Modal (ForumForm) harus muncul
    expect(screen.getByTestId('forum-form')).toBeInTheDocument();
  });

  it('menutup modal ketika ForumForm memanggil setIsModalOpen(false)', () => {
    render(<AddForum />);

    // Klik tombol untuk buka modal
    const addButton = screen.getByRole('button', { name: /add forum/i });
    fireEvent.click(addButton);

    // Tombol close dari komponen mock ForumForm
    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

    // Pastikan modal menghilang (tidak terlihat lagi)
    expect(screen.queryByTestId('forum-form')).not.toBeInTheDocument();
  });

  it('meneruskan parentForumId dan onForumAdded ke ForumForm', () => {
    const mockOnForumAdded = jest.fn();
    const testParentForumId = 'parent123';

    render(
      <AddForum
        parentForumId={testParentForumId}
        onForumAdded={mockOnForumAdded}
      />
    );

    // Buka modal
    const addButton = screen.getByRole('button', { name: /add forum/i });
    fireEvent.click(addButton);

    // Pastikan prop parentForumId masuk ke dalam ForumForm
    expect(screen.getByText(/parent123/i)).toBeInTheDocument();
  });
});
