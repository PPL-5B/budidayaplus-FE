import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ReplyForm from '@/components/forum/ReplyForm';
import '@testing-library/jest-dom';

// Mock createReply API
jest.mock('@/lib/forum/createReply', () => ({
  createReply: jest.fn(),
}));

import { createReply } from '@/lib/forum/createReply';

describe('ReplyForm Component', () => {
  const mockSetIsModalOpen = jest.fn();
  const mockOnReplyAdded = jest.fn();
  const parentForumId = 'forum123';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  // Test 1: Rendering
  it('should render all form elements correctly', () => {
    render(
      <ReplyForm 
        setIsModalOpen={mockSetIsModalOpen} 
        parentForumId={parentForumId} 
      />
    );

    expect(screen.getByText('Balas Forum')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Masukkan balasan Anda...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Simpan/i })).toBeInTheDocument();
    expect(screen.getByLabelText('Deskripsi')).toBeInTheDocument();
  });

  // Test 2: Form Validation
  it('should show error when description is empty', async () => {
    render(
      <ReplyForm 
        setIsModalOpen={mockSetIsModalOpen} 
        parentForumId={parentForumId} 
      />
    );

    const submitButton = screen.getByRole('button', { name: /Simpan/i });
    await userEvent.click(submitButton);

    expect(await screen.findByText(/Deskripsi wajib diisi/i)).toBeInTheDocument();
    expect(createReply).not.toHaveBeenCalled();
  });

  // Test 3: Successful Submission
  it('should submit form successfully with valid data', async () => {
    (createReply as jest.Mock).mockResolvedValueOnce({});

    render(
      <ReplyForm 
        setIsModalOpen={mockSetIsModalOpen} 
        parentForumId={parentForumId}
        onReplyAdded={mockOnReplyAdded}
      />
    );

    const descriptionInput = screen.getByPlaceholderText('Masukkan balasan Anda...');
    const submitButton = screen.getByRole('button', { name: /Simpan/i });

    await userEvent.type(descriptionInput, 'Test reply content');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(createReply).toHaveBeenCalledWith({
        description: 'Test reply content',
        parent_id: parentForumId,
      });
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(mockOnReplyAdded).toHaveBeenCalled();
    });
  });

  // Test 4: Loading State
  it('should show loading state when submitting', async () => {
    (createReply as jest.Mock).mockImplementationOnce(
      () => new Promise((resolve) => setTimeout(resolve, 1000))
    );

    render(
      <ReplyForm 
        setIsModalOpen={mockSetIsModalOpen} 
        parentForumId={parentForumId}
      />
    );

    const descriptionInput = screen.getByPlaceholderText('Masukkan balasan Anda...');
    const submitButton = screen.getByRole('button', { name: /Simpan/i });

    await userEvent.type(descriptionInput, 'Test reply content');
    await userEvent.click(submitButton);

    expect(await screen.findByText(/Menyimpan.../i)).toBeInTheDocument();
  });

  // Test 5: Error Handling
  it('should handle submission error gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    (createReply as jest.Mock).mockRejectedValueOnce(new Error('API Error'));

    render(
      <ReplyForm 
        setIsModalOpen={mockSetIsModalOpen} 
        parentForumId={parentForumId}
      />
    );

    const descriptionInput = screen.getByPlaceholderText('Masukkan balasan Anda...');
    const submitButton = screen.getByRole('button', { name: /Simpan/i });

    await userEvent.type(descriptionInput, 'Error test reply');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(createReply).toHaveBeenCalledWith({
        description: 'Error test reply',
        parent_id: parentForumId,
      });
      expect(mockSetIsModalOpen).not.toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalledWith('Error creating reply:', expect.any(Error));
    });

    consoleErrorSpy.mockRestore();
  });

  // Test 6: Form Reset After Submission
  it('should reset form after successful submission', async () => {
    (createReply as jest.Mock).mockResolvedValueOnce({});

    render(
      <ReplyForm 
        setIsModalOpen={mockSetIsModalOpen} 
        parentForumId={parentForumId}
      />
    );

    const descriptionInput = screen.getByPlaceholderText('Masukkan balasan Anda...');
    const submitButton = screen.getByRole('button', { name: /Simpan/i });

    await userEvent.type(descriptionInput, 'Test reply content');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(descriptionInput).toHaveValue('');
    });
  });
});