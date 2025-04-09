import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import EditForumForm from '@/components/forum/EditForum';
import '@testing-library/jest-dom';
import { updateForum } from '@/lib/forum/updateForum';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/lib/forum/updateForum', () => ({
  updateForum: jest.fn(),
}));

describe('EditForumForm', () => {
  const forumId = '123';
  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (global.fetch as jest.Mock) = jest.fn();
  });

  it('menampilkan data deskripsi dari fetch', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ description: 'Deskripsi lama' }),
    });

    render(<EditForumForm forumId={forumId} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/edit deskripsi/i)).toHaveValue('Deskripsi lama');
    });
  });

  it('menangani error fetch dengan alert', async () => {
    jest.spyOn(console, 'error').mockImplementation(() => {});
    window.alert = jest.fn();

    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Gagal ambil'));

    render(<EditForumForm forumId={forumId} />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Gagal mengambil data forum');
    });
  });

  it('update forum sukses', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ description: 'desc lama' }),
    });
    (updateForum as jest.Mock).mockResolvedValue({ success: true });

    render(<EditForumForm forumId={forumId} />);
    const textarea = await screen.findByPlaceholderText(/edit deskripsi/i);
    fireEvent.change(textarea, { target: { value: 'desc baru' } });

    const button = screen.getByRole('button', { name: /simpan perubahan/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(updateForum).toHaveBeenCalled();
      expect(mockPush).toHaveBeenCalledWith('/forum?updated=true');
    });
  });

  it('update forum gagal dengan message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ description: 'desc awal' }),
    });
    (updateForum as jest.Mock).mockResolvedValue({ success: false, message: 'gagal update' });
    window.alert = jest.fn();

    render(<EditForumForm forumId={forumId} />);
    const button = await screen.findByRole('button', { name: /simpan perubahan/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('gagal update');
    });
  });

  it('update forum gagal tanpa message', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ description: 'awal' }),
    });
    (updateForum as jest.Mock).mockResolvedValue({ success: false });
    window.alert = jest.fn();

    render(<EditForumForm forumId={forumId} />);
    const button = await screen.findByRole('button', { name: /simpan perubahan/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Gagal update forum');
    });
  });

  it('menampilkan loading state', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ description: 'init' }),
    });

    let resolveUpdate: (value: { success: boolean }) => void = () => {};
    (updateForum as jest.Mock).mockImplementation(() => {
      return new Promise((resolve) => {
        resolveUpdate = resolve;
      });
    });

    render(<EditForumForm forumId={forumId} />);
    const button = await screen.findByRole('button', { name: /simpan perubahan/i });
    fireEvent.click(button);

    expect(button).toHaveTextContent('Menyimpan...');

    resolveUpdate({ success: true });
  });

  it('menangani fetch response dengan res.ok === false', async () => {
    window.alert = jest.fn();
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({}),
    });

    render(<EditForumForm forumId={forumId} />);

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith('Gagal mengambil data forum');
    });
  });

  it('fallback ke deskripsi kosong jika data.description tidak ada', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({}), // <-- description undefined
    });

    render(<EditForumForm forumId={forumId} />);

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/edit deskripsi/i)).toHaveValue('');
    });
  });
});
