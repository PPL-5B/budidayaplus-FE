import { render, screen, waitFor } from '@testing-library/react';
import UpdateProfileForm from '@/components/profile/UpdateProfileForm';
import type { Profile } from '@/types/profile';
import userEvent from '@testing-library/user-event';

// Mock dependencies
const toastMock = jest.fn();
jest.mock('@/hooks/use-toast', () => ({
  useToast: () => ({ toast: toastMock }),
}));

const updateProfileMock = jest.fn();
jest.mock('@/lib/profile', () => ({
  updateProfile: (...args: any) => updateProfileMock(...args),
}));

describe('UpdateProfileForm', () => {
  const setIsModalOpenMock = jest.fn();

  const mockProfile: Profile = {
    id: 1,
    image_name: 'profile1.png',
    role: 'worker',
    user: {
      id: 1,
      first_name: 'John',
      last_name: 'Doe',
      phone_number: '08123456789',
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders input fields correctly with default values', () => {
    render(<UpdateProfileForm profile={mockProfile} setIsModalOpen={setIsModalOpenMock} />);

    expect(screen.getByPlaceholderText('Nama Depan')).toHaveValue('John');
    expect(screen.getByPlaceholderText('Nama Belakang')).toHaveValue('Doe');
  });

  it('submits form successfully, shows success toast, and closes modal', async () => {
    updateProfileMock.mockResolvedValue(true);

    render(<UpdateProfileForm profile={mockProfile} setIsModalOpen={setIsModalOpenMock} />);

    await userEvent.clear(screen.getByPlaceholderText('Nama Depan'));
    await userEvent.type(screen.getByPlaceholderText('Nama Depan'), 'Jane');
    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(updateProfileMock).toHaveBeenCalledWith({ first_name: 'Jane', last_name: 'Doe' });
      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ title: 'Berhasil mengupdate profil' }));
      expect(setIsModalOpenMock).toHaveBeenCalledWith(false);
    });
  });

  

  it('handles failed updateProfile gracefully with error toast', async () => {
    updateProfileMock.mockResolvedValue(false);

    render(<UpdateProfileForm profile={mockProfile} setIsModalOpen={setIsModalOpenMock} />);

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith(expect.objectContaining({ title: 'Gagal mengupdate profil' }));
      expect(setIsModalOpenMock).toHaveBeenCalledWith(false);
    });
  });

  it('renders correctly without profile', () => {
    render(<UpdateProfileForm setIsModalOpen={setIsModalOpenMock} />);

    expect(screen.getByPlaceholderText('Nama Depan')).toHaveValue('');
    expect(screen.getByPlaceholderText('Nama Belakang')).toHaveValue('');
  });

  it('submit button is disabled while submitting (loading state)', async () => {
    let resolveSubmit: any;
    updateProfileMock.mockImplementation(() => new Promise((resolve) => { resolveSubmit = resolve }));

    render(<UpdateProfileForm profile={mockProfile} setIsModalOpen={setIsModalOpenMock} />);

    await userEvent.click(screen.getByRole('button', { name: /submit/i }));

    // while waiting for the promise, button should be disabled
    expect(screen.getByRole('button', { name: /submit/i })).toBeDisabled();

    resolveSubmit(true);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /submit/i })).not.toBeDisabled();
    });
  });
});
