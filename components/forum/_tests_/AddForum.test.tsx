import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import AddForum from '@/components/forum/AddForum';

jest.mock('@/components/forum/ForumForm', () => {
  return function DummyForumForm(props: any) {
    return <div>Dummy Forum Form</div>;
  };
});

describe('AddForum Component', () => {
  it('renders the Add Forum button', () => {
    render(<AddForum />);
    const button = screen.getByRole('button', { name: /add forum/i });
    expect(button).toBeInTheDocument();
  });

  it('opens the modal when the button is clicked', () => {
    render(<AddForum />);
    
    expect(screen.queryByText(/create forum/i)).not.toBeInTheDocument();

    const button = screen.getByRole('button', { name: /add forum/i });
    fireEvent.click(button);

    expect(screen.getByText(/create forum/i)).toBeInTheDocument();

    expect(screen.getByText(/dummy forum form/i)).toBeInTheDocument();
  });
});
