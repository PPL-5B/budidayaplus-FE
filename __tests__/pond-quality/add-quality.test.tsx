import { fireEvent, render, screen, waitFor, act } from '@testing-library/react';
import { AddPondQuality } from '@/components/pond-quality';
import { addOrUpdatePondQuality } from '@/lib/pond-quality';

jest.mock('@/lib/pond-quality', () => ({
  addOrUpdatePondQuality: jest.fn(),
}));

describe('Add Pond Quality Modal', () => {
  const pondId = 'test-pond-id';
  const cycleId = 'test-cycle-id';

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form fields correctly', async () => {
    render(<AddPondQuality pondId={pondId} cycleId={cycleId} />);

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /sample/i }));
    });

    expect(screen.getByPlaceholderText('Level pH')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Salinitas')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Temperatur Air')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Kejernihan Air')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Sirkulasi Air')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Oksigen Terlarut')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('ORP')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Ammonia')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Nitrate')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Phosphate')).toBeInTheDocument();
  });

  it('closes the modal after successful form submission', async () => {

    global.fetch = jest.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true }),
      } as Response)
    );

    const mockResponse = { success: true, message: 'Pond quality added' };
    (addOrUpdatePondQuality as jest.Mock).mockResolvedValue(mockResponse);

    render(<AddPondQuality pondId={pondId} cycleId={cycleId}/>);

    fireEvent.click(screen.getByRole('button', { name: /sample/i }));

    fireEvent.change(screen.getByPlaceholderText('Level pH'), { target: { value: '7.0' } });
    fireEvent.change(screen.getByPlaceholderText('Salinitas'), { target: { value: '30' } });
    fireEvent.change(screen.getByPlaceholderText('Temperatur Air'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Kejernihan Air'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Sirkulasi Air'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Oksigen Terlarut'), { target: { value: '8' } });
    fireEvent.change(screen.getByPlaceholderText('ORP'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('Ammonia'), { target: { value: '0.5' } });
    fireEvent.change(screen.getByPlaceholderText('Nitrate'), { target: { value: '1.0' } });
    fireEvent.change(screen.getByPlaceholderText('Phosphate'), { target: { value: '0.2' } });
    

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /simpan/i }));
    });

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });

  it('displays error message when backend says pond quality creation failed', async () => {
    const mockResponse = { success: false, message: 'Failed to create pond quality' };
    (addOrUpdatePondQuality as jest.Mock).mockResolvedValue(mockResponse);
    const file = new File(['(⌐□_□)'], 'pond.jpg', { type: 'image/jpg' });
  
    render(<AddPondQuality pondId={pondId} cycleId={cycleId}/>);
  
    fireEvent.click(screen.getByRole('button', { name: /sample/i }));
  
    fireEvent.change(screen.getByPlaceholderText('Level pH'), { target: { value: '6.0' } });
    fireEvent.change(screen.getByPlaceholderText('Salinitas'), { target: { value: '20' } });
    fireEvent.change(screen.getByPlaceholderText('Temperatur Air'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Kejernihan Air'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Sirkulasi Air'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Oksigen Terlarut'), { target: { value: '8' } });
    fireEvent.change(screen.getByPlaceholderText('ORP'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('Ammonia'), { target: { value: '0.5' } });
    fireEvent.change(screen.getByPlaceholderText('Nitrate'), { target: { value: '1.0' } });
    fireEvent.change(screen.getByPlaceholderText('Phosphate'), { target: { value: '0.2' } });
    fireEvent.change(screen.getByTestId('image'), { target: { files: [file] } });
  
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /simpan/i }));
    });

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan kualitas air')).toBeInTheDocument();
    });
  });
  

  it('displays error message and sets error state when form submission fails', async () => {
    const mockError = new Error('Gagal menambah kualitas air');
    const file = new File(['(⌐□_□)'], 'pond.jpg', { type: 'image/jpg' });
    (addOrUpdatePondQuality as jest.Mock).mockRejectedValueOnce(mockError);


    render(<AddPondQuality pondId={pondId} cycleId={cycleId}/>);

    fireEvent.click(screen.getByRole('button', { name: /sample/i }));

    fireEvent.change(screen.getByPlaceholderText('Level pH'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Salinitas'), { target: { value: '15' } });
    fireEvent.change(screen.getByPlaceholderText('Temperatur Air'), { target: { value: '25' } });
    fireEvent.change(screen.getByPlaceholderText('Kejernihan Air'), { target: { value: '10' } });
    fireEvent.change(screen.getByPlaceholderText('Sirkulasi Air'), { target: { value: '5' } });
    fireEvent.change(screen.getByPlaceholderText('Oksigen Terlarut'), { target: { value: '8' } });
    fireEvent.change(screen.getByPlaceholderText('ORP'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('Ammonia'), { target: { value: '0.5' } });
    fireEvent.change(screen.getByPlaceholderText('Nitrate'), { target: { value: '1.0' } });
    fireEvent.change(screen.getByPlaceholderText('Phosphate'), { target: { value: '0.2' } });
    fireEvent.change(screen.getByTestId('image'), { target: { files: [file] } });

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('Gagal menyimpan kualitas air')).toBeInTheDocument();
    });
  });

  it('does not allow form submission when any of the fields are invalid', async () => {
    render(<AddPondQuality pondId={pondId} cycleId={cycleId}/>);

    fireEvent.click(screen.getByRole('button', { name: /sample/i }));

    fireEvent.change(screen.getByPlaceholderText('Level pH'), { target: { value: '-1' } });
    fireEvent.change(screen.getByPlaceholderText('Salinitas'), { target: { value: '-5' } });
    fireEvent.change(screen.getByPlaceholderText('Temperatur Air'), { target: { value: '-3' } });

    fireEvent.click(screen.getByRole('button', { name: /Simpan/i }));

    await waitFor(() => {
      expect(screen.getByText('pH harus minimal 0')).toBeInTheDocument();
      expect(screen.getByText('Salinitas harus berupa angka positif')).toBeInTheDocument();
      expect(screen.getByText('Temperatur air harus berupa angka positif')).toBeInTheDocument();
      expect(addOrUpdatePondQuality).not.toHaveBeenCalled();
    });
  });

  it('handles file input correctly', async () => {
    render(<AddPondQuality pondId={pondId} cycleId={cycleId}/>);

    fireEvent.click(screen.getByRole('button', { name: /sample/i }));

    const fileInput = screen.getByTestId('image');
    const file = new File(['pond-quality'], 'quality.jpg', { type: 'image/jpg' });

    fireEvent.change(fileInput, { target: { files: [file] } });

    if (fileInput instanceof HTMLInputElement) {
      expect(fileInput.files![0]).toBe(file);
      expect(fileInput.files).toHaveLength(1);
    } else {
      throw new Error("fileInput is not an HTMLInputElement");
    }
  });
});

  