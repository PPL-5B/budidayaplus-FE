import { render, screen } from '@testing-library/react';
import ProfileComponent from '@/components/profile/ProfileComponent';
import type { Profile } from '@/types/profile';

// Mock UpdateProfileModal
jest.mock('@/components/profile/UpdateProfileModal', () => ({
  UpdateProfileModal: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="update-profile-modal">{children}</div>
  ),
}));

describe('ProfileComponent', () => {
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

  it('renders user first name and phone number correctly', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />);

    expect(screen.getByText('Halo, John!')).toBeInTheDocument();
    expect(screen.getByText('08123456789')).toBeInTheDocument();
  });



  it('does NOT render UpdateProfileModal if isUserSelf is false', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />);

    expect(screen.queryByTestId('update-profile-modal')).not.toBeInTheDocument();
    expect(screen.queryByText('Ubah Profil')).not.toBeInTheDocument();
  });

  it('handles missing optional isUserSelf prop (edge case)', () => {
    render(<ProfileComponent profile={mockProfile} />); // isUserSelf not passed

    expect(screen.getByText('Halo, John!')).toBeInTheDocument();
    expect(screen.getByText('08123456789')).toBeInTheDocument();
    expect(screen.queryByTestId('update-profile-modal')).not.toBeInTheDocument();
  });


});