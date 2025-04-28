import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ForumForm from '@/components/forum/ForumForm';
import '@testing-library/jest-dom';
import userEvent from '@testing-library/user-event';

// Mock createForum API
jest.mock('@/lib/forum/createForum', () => ({
  createForum: jest.fn(),
}));

import { createForum } from '@/lib/forum/createForum';

describe('ForumForm', () => {
  const mockSetIsModalOpen = jest.fn();
  const mockOnForumAdded = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields and submit button', () => {
    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/tag/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument();
  });

  it('shows validation error when submitted with empty fields', async () => {
    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(screen.getAllByText(/required/i).length).toBeGreaterThan(0);
    });
  });

  it('submits valid data and closes modal + calls onForumAdded', async () => {
    (createForum as jest.Mock).mockResolvedValueOnce({});

    render(
      <ForumForm
        setIsModalOpen={mockSetIsModalOpen}
        onForumAdded={mockOnForumAdded}
        parentForumId="parent123"
      />
    );

    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);
    const tagSelect = screen.getByLabelText(/tag/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'Test Forum Title');
    await userEvent.type(descriptionTextarea, 'Test Forum Description');
    fireEvent.change(tagSelect, { target: { value: 'kolam' } });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalledWith({
        title: 'Test Forum Title',
        description: 'Test Forum Description',
        tag: 'kolam',
        parent_id: 'parent123',
      });

      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockOnForumAdded).toHaveBeenCalled();
    });
  });

  it('submits valid data without onForumAdded callback', async () => {
    (createForum as jest.Mock).mockResolvedValueOnce({});

    render(
      <ForumForm
        setIsModalOpen={mockSetIsModalOpen}
        parentForumId="parent123"
      />
    );

    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(descriptionTextarea, 'Test Description');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalled();
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
    });
  });

  it('submits with null parent_id when parentForumId is not provided', async () => {
    (createForum as jest.Mock).mockResolvedValueOnce({});

    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'Test Title');
    await userEvent.type(descriptionTextarea, 'Test Description');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalledWith(expect.objectContaining({
        parent_id: null
      }));
    });
  });

  it('tests all tag options', async () => {
    (createForum as jest.Mock).mockResolvedValue({});

    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    const tagSelect = screen.getByLabelText(/tag/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });
    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);

    const tags = ['ikan', 'kolam', 'siklus', 'budidayaplus'];

    for (const tag of tags) {
      await userEvent.type(titleInput, `Test ${tag}`);
      await userEvent.type(descriptionTextarea, `Description for ${tag}`);
      fireEvent.change(tagSelect, { target: { value: tag } });

      fireEvent.click(submitButton);

      await waitFor(() => {
        expect(createForum).toHaveBeenCalledWith(expect.objectContaining({
          tag
        }));
      });

      // Clear inputs for next iteration
      fireEvent.change(titleInput, { target: { value: '' } });
      fireEvent.change(descriptionTextarea, { target: { value: '' } });
    }
  });

  it('handles error from createForum without closing modal', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (createForum as jest.Mock).mockRejectedValueOnce(new Error('API failed'));

    render(<ForumForm setIsModalOpen={mockSetIsModalOpen} />);

    const titleInput = screen.getByPlaceholderText(/enter forum title/i);
    const descriptionTextarea = screen.getByPlaceholderText(/enter forum description/i);
    const submitButton = screen.getByRole('button', { name: /submit/i });

    await userEvent.type(titleInput, 'Error Title');
    await userEvent.type(descriptionTextarea, 'Error Description');

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createForum).toHaveBeenCalled();
      expect(mockSetIsModalOpen).not.toHaveBeenCalled();
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error creating forum:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  it('calls onForumAdded callback when provided and submission succeeds', async () => {
    (createForum as jest.Mock).mockResolvedValueOnce({});
    
    render(
      <ForumForm 
        setIsModalOpen={mockSetIsModalOpen}
        onForumAdded={mockOnForumAdded}
      />
    );
  
    // Fill out and submit form
    await userEvent.type(screen.getByPlaceholderText(/enter forum title/i), 'Test Title');
    await userEvent.type(screen.getByPlaceholderText(/enter forum description/i), 'Test Description');
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
    await waitFor(() => {
      expect(mockOnForumAdded).toHaveBeenCalledTimes(1);
    });
  });
  
  it('does not call onForumAdded when not provided', async () => {
    (createForum as jest.Mock).mockResolvedValueOnce({});
    
    render(
      <ForumForm 
        setIsModalOpen={mockSetIsModalOpen}
        // No onForumAdded prop
      />
    );
  
    // Fill out and submit form
    await userEvent.type(screen.getByPlaceholderText(/enter forum title/i), 'Test Title');
    await userEvent.type(screen.getByPlaceholderText(/enter forum description/i), 'Test Description');
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
  
    await waitFor(() => {
      expect(mockOnForumAdded).not.toHaveBeenCalled();
    });
  });
});