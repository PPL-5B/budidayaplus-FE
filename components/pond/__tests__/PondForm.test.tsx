import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PondForm from '@/components/pond/PondForm';
import { Pond } from '@/types/pond';
import { useForm } from 'react-hook-form';
import { addOrUpdatePond } from '@/lib/pond';
import '@testing-library/jest-dom';

// Mock dependencies
jest.mock('react-hook-form', () => ({
  ...jest.requireActual('react-hook-form'),
  useForm: jest.fn(),
}));

jest.mock('@hookform/resolvers/zod');
jest.mock('@/lib/pond', () => ({
  addOrUpdatePond: jest.fn(),
}));

jest.mock('@/lib/utils', () => ({
  objectToFormData: jest.fn().mockImplementation(obj => obj),
}));

describe('PondForm Component', () => {
  const mockSetIsModalOpen = jest.fn();
  const mockPond: Pond = {
    pond_id: 'pond-123',
    name: 'Kolam Lele',
    length: 10,
    width: 5,
    depth: 2,
  };

  const mockUseForm = (overrides = {}) => {
    (useForm as jest.Mock).mockReturnValue({
      register: jest.fn(),
      handleSubmit: (fn: any) => (e: any) => {
        e.preventDefault();
        fn({
          name: 'Kolam Baru',
          length: '12',
          width: '6',
          depth: '1.5',
          image: { 0: {} },
        });
      },
      watch: (field: string) => {
        if (field === 'width') return 6;
        if (field === 'length') return 12;
        if (field === 'depth') return 1.5;
        if (field === 'image') return { 0: {} };
        return null;
      },
      reset: jest.fn(),
      formState: { errors: {}, isSubmitting: false },
      ...overrides,
    });
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseForm();
    window.location = { reload: jest.fn() } as any;
  });

  it('renders form fields correctly for new pond', () => {
    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByPlaceholderText('Nama Kolam')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Panjang (meter)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Lebar (meter)')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Kedalaman (meter)')).toBeInTheDocument();
    expect(screen.getByTestId('image')).toBeInTheDocument();
    expect(screen.getByText('Tambah Kolam')).toBeInTheDocument();
  });

  it('pre-fills form when editing existing pond', () => {
    mockUseForm({
      defaultValues: {
        name: mockPond.name,
        length: mockPond.length,
        width: mockPond.width,
        depth: mockPond.depth,
      },
    });

    render(<PondForm pond={mockPond} setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByDisplayValue(mockPond.name)).toBeInTheDocument();
    expect(screen.getByText('Edit Kolam')).toBeInTheDocument();
  });

  it('calculates and displays volume', () => {
    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByText('Volume: 108.00 m³')).toBeInTheDocument();
  });

  it('does not display volume when dimensions are missing', () => {
    mockUseForm({
      watch: () => null,
    });

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.queryByText(/Volume:/)).not.toBeInTheDocument();
  });

  it('submits form data correctly', async () => {
    (addOrUpdatePond as jest.Mock).mockResolvedValue({ success: true });
    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(addOrUpdatePond).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Kolam Baru',
          length: '12',
          width: '6',
          depth: '1.5',
          image: { 0: {} },
        }),
        undefined
      );
    });
  });

  it('handles edit mode with pond ID', async () => {
    (addOrUpdatePond as jest.Mock).mockResolvedValue({ success: true });
    render(<PondForm pond={mockPond} setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(addOrUpdatePond).toHaveBeenCalledWith(
        expect.any(Object),
        mockPond.pond_id
      );
    });
  });

  it('shows error message when submission fails', async () => {
    (addOrUpdatePond as jest.Mock).mockResolvedValue({ success: false });
    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);

    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan kolam')).toBeInTheDocument();
    });
  });

  it('shows validation errors', () => {
    mockUseForm({
      formState: {
        errors: {
          name: { message: 'Nama kolam wajib diisi' },
          length: { message: 'Panjang harus angka positif' },
          width: { message: 'Lebar harus angka positif' },
          depth: { message: 'Kedalaman harus angka positif' },
          image: { message: 'Gambar wajib diisi' },
        },
        isSubmitting: false,
      },
    });

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);

    expect(screen.getByText('Nama kolam wajib diisi')).toBeInTheDocument();
    expect(screen.getByText('Panjang harus angka positif')).toBeInTheDocument();
    expect(screen.getByText('Lebar harus angka positif')).toBeInTheDocument();
    expect(screen.getByText('Kedalaman harus angka positif')).toBeInTheDocument();
    expect(screen.getByText('Gambar wajib diisi')).toBeInTheDocument();
  });

  it('shows loading state on submit button', () => {
    mockUseForm({
      formState: { isSubmitting: true },
    });

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);
    expect(screen.getByText('Menyimpan...')).toBeInTheDocument();
  });

  it('closes modal and reloads on success', async () => {
    (addOrUpdatePond as jest.Mock).mockResolvedValue({ success: true });

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
      expect(window.location.reload).toHaveBeenCalled();
    });
  });

  it('handles form submission error', async () => {
    (addOrUpdatePond as jest.Mock).mockRejectedValue(new Error('Network error'));

    render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);
    fireEvent.submit(screen.getByRole('form'));

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan kolam')).toBeInTheDocument();
    });
  });

  it('clears volume calculation on unmount', () => {
    const { unmount } = render(<PondForm setIsModalOpen={mockSetIsModalOpen} />);
    expect(screen.getByText('Volume: 108.00 m³')).toBeInTheDocument();
    unmount();
  });
});