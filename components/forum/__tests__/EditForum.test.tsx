import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditForumForm from '@/components/forum/EditForum';
import '@testing-library/jest-dom';
import { updateForum } from '@/lib/forum/updateForum';

jest.mock('@/lib/forum/updateForum', () => ({
  updateForum: jest.fn(),
}));

describe('EditForumForm', () => {
  const mockProps = {
    forumId: '123',
    initialTitle: 'Judul Awal',
    initialDesc: 'Deskripsi Awal',
    onUpdateSuccess: jest.fn(),
    onCancel: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('menampilkan data awal dengan benar', () => {
    render(<EditForumForm {...mockProps} />);
    
    expect(screen.getByDisplayValue('Judul Awal')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Deskripsi Awal')).toBeInTheDocument();
  });

  it('memperbarui judul dan deskripsi saat input diubah', () => {
    render(<EditForumForm {...mockProps} />);
    
    const titleInput = screen.getByDisplayValue('Judul Awal');
    const descInput = screen.getByDisplayValue('Deskripsi Awal');

    fireEvent.change(titleInput, { target: { value: 'Judul Baru' } });
    fireEvent.change(descInput, { target: { value: 'Deskripsi Baru' } });

    expect(titleInput).toHaveValue('Judul Baru');
    expect(descInput).toHaveValue('Deskripsi Baru');
  });

  it('menampilkan error ketika deskripsi kosong', () => {
    render(<EditForumForm {...mockProps} />);
    
    const descInput = screen.getByDisplayValue('Deskripsi Awal');
    fireEvent.change(descInput, { target: { value: '   ' } });
    
    const saveButton = screen.getByRole('button', { name: /simpan/i });
    fireEvent.click(saveButton);

    expect(screen.getByText('Deskripsi tidak boleh kosong')).toBeInTheDocument();
    expect(mockProps.onUpdateSuccess).not.toHaveBeenCalled();
  });

  it('memanggil onCancel ketika tombol batal diklik', () => {
    render(<EditForumForm {...mockProps} />);
    
    const cancelButton = screen.getByRole('button', { name: /batal/i });
    fireEvent.click(cancelButton);

    expect(mockProps.onCancel).toHaveBeenCalled();
  });

  it('memanggil onUpdateSuccess ketika update berhasil', async () => {
    (updateForum as jest.Mock).mockResolvedValue({ success: true });
    
    render(<EditForumForm {...mockProps} />);
    
    const saveButton = screen.getByRole('button', { name: /simpan/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateForum).toHaveBeenCalledWith(
        '123',
        'Judul Awal',
        'Deskripsi Awal'
      );
      expect(mockProps.onUpdateSuccess).toHaveBeenCalledWith(
        'Deskripsi Awal',
        'Judul Awal'
      );
    });
  });

  it('menampilkan error ketika update gagal', async () => {
    (updateForum as jest.Mock).mockResolvedValue({ 
      success: false, 
      message: 'Error message' 
    });
    
    render(<EditForumForm {...mockProps} />);
    
    const saveButton = screen.getByRole('button', { name: /simpan/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Error message')).toBeInTheDocument();
    });
  });

  it('menampilkan error generic ketika terjadi exception', async () => {
    (updateForum as jest.Mock).mockRejectedValue(new Error('Network error'));
    console.error = jest.fn();
    
    render(<EditForumForm {...mockProps} />);
    
    const saveButton = screen.getByRole('button', { name: /simpan/i });
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Terjadi kesalahan saat menyimpan')).toBeInTheDocument();
      expect(console.error).toHaveBeenCalledWith('Error:', expect.any(Error));
    });
  });

  it('menampilkan loading state saat menyimpan', async () => {
    let resolveUpdate: (value: any) => void;
    (updateForum as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        resolveUpdate = resolve;
      });
    });
    
    render(<EditForumForm {...mockProps} />);
    
    const saveButton = screen.getByRole('button', { name: /simpan/i });
    fireEvent.click(saveButton);

    expect(screen.getByText('Menyimpan...')).toBeInTheDocument();

    resolveUpdate!({ success: true });
    
    await waitFor(() => {
      expect(screen.queryByText('Menyimpan...')).not.toBeInTheDocument();
    });
  });
});