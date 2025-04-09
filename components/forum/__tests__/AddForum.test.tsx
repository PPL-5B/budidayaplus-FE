import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddForum from '@/components/forum/AddForum';
import '@testing-library/jest-dom';

// Mock dependencies
const MockForumForm = (props: {
  parentForumId?: string;
  setIsModalOpen: (val: boolean) => void;
}) => (
  <div data-testid="forum-form">
    ForumForm mocked - parentForumId: {props.parentForumId?.toString() ?? 'none'}
    <button onClick={() => props.setIsModalOpen(false)}>Close Modal</button>
  </div>
);
MockForumForm.displayName = 'MockForumForm';

jest.mock('@/components/forum/ForumForm', () => ({
  __esModule: true,
  default: MockForumForm,
}));

describe('AddForum', () => {
  it('renders button and opens modal on click', () => {
    render(<AddForum />);

    const addButton = screen.getByRole('button', { name: /add forum/i });
    expect(addButton).toBeInTheDocument();

    fireEvent.click(addButton);
    expect(screen.getByTestId('forum-form')).toBeInTheDocument();
  });

  it('menutup modal ketika ForumForm memanggil setIsModalOpen(false)', () => {
    render(<AddForum />);

    const addButton = screen.getByRole('button', { name: /add forum/i });
    fireEvent.click(addButton);

    const closeButton = screen.getByText('Close Modal');
    fireEvent.click(closeButton);

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

    const addButton = screen.getByRole('button', { name: /add forum/i });
    fireEvent.click(addButton);

    expect(screen.getByText(/parent123/i)).toBeInTheDocument();
  });
});
