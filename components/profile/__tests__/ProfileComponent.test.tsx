// ProfileComponent.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import ProfileComponent from '@/components/profile/ProfileComponent'
import { Profile } from '@/types/profile'

// Mock the UpdateProfileModal component
jest.mock('@/components/profile/UpdateProfileModal', () => ({
  __esModule: true,
  default: ({ children, profile }: { children: React.ReactNode; profile: Profile }) => (
    <div data-testid="update-profile-modal" data-profile-id={profile.id}>
      {children}
    </div>
  ),
}))

// Mock the logout module
jest.mock('@/lib/auth/logout/logoutAction', () => ({
  logout: jest.fn(),
}))

// Mock the LogOut icon
jest.mock('lucide-react', () => ({
  LogOut: jest.fn(() => <svg data-testid="logout-icon" />),
}))

describe('ProfileComponent', () => {
  const mockProfile: Profile = {
    id: 1,
    role: 'worker',
    image_name: 'default.jpg',
    user: {
      id: 10,
      first_name: 'Dina',
      last_name: 'Putri',
      phone_number: '081234567890',
    },
  }

  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks()
  })

  it('renders outer container with correct styling', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />)
    
    const container = screen.getByTestId('profile-component')
    expect(container).toHaveClass(
      'flex flex-col items-center justify-center py-4 bg-[#EAF0FF] rounded-xl p-4 w-full max-w-md mx-auto'
    )
  })

  it('renders inner card with correct styling', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />)
    
    const card = screen.getByTestId('profile-card')
    expect(card).toHaveClass(
      'bg-[#2254C5] rounded-xl p-4 w-full flex flex-col space-y-2 min-h-[130px] justify-center'
    )
  })

  it('renders header with correct styling', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />)
    
    const header = screen.getByTestId('profile-header')
    expect(header).toHaveClass('flex items-center justify-between w-full')
  })

  it('renders greeting with correct styling and content', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />)
    
    const greeting = screen.getByTestId('profile-greeting')
    expect(greeting).toHaveClass('text-[#EAF0FF] text-2xl font-bold')
    expect(greeting).toHaveTextContent('Halo, Dina!')
  })

  it('renders phone number with correct styling', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />)
    
    const phoneNumber = screen.getByTestId('phone-number')
    expect(phoneNumber).toHaveClass('text-[#EAF0FF] text-base')
  })

  it('does not render logout button when isUserSelf is false', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />)
    
    expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument()
  })

  it('renders logout button with correct styling when isUserSelf is true', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={true} />)
    
    const logoutButton = screen.getByTestId('logout-button')
    expect(logoutButton).toHaveClass('flex items-center gap-1 text-white hover:text-red-300')
  })

  it('renders logout icon with correct props', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={true} />)
    
    const logoutIcon = screen.getByTestId('logout-icon')
    expect(logoutIcon).toBeInTheDocument()
  })

  it('renders logout text with correct styling', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={true} />)
    
    const logoutText = screen.getByTestId('logout-text')
    expect(logoutText).toHaveClass('text-sm font-medium')
    expect(logoutText).toHaveTextContent('Keluar')
  })

  it('calls logout function when logout button is clicked', () => {
    const { logout } = require('@/lib/auth/logout/logoutAction')
    render(<ProfileComponent profile={mockProfile} isUserSelf={true} />)
    
    fireEvent.click(screen.getByTestId('logout-button'))
    expect(logout).toHaveBeenCalledTimes(1)
  })

  it('does not render edit profile link when isUserSelf is false', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={false} />)
    
    expect(screen.queryByTestId('edit-profile-link')).not.toBeInTheDocument()
  })

  it('renders edit profile link with correct styling when isUserSelf is true', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={true} />)
    
    const editLink = screen.getByTestId('edit-profile-link')
    expect(editLink).toHaveClass('underline text-[#EAF0FF] cursor-pointer text-base')
  })

  it('renders UpdateProfileModal with correct props', () => {
    render(<ProfileComponent profile={mockProfile} isUserSelf={true} />)
    
    const modal = screen.getByTestId('update-profile-modal')
    expect(modal).toHaveAttribute('data-profile-id', '1')
  })

  it('handles empty first name gracefully', () => {
    const emptyNameProfile = {
      ...mockProfile,
      user: { ...mockProfile.user, first_name: '' },
    }
    render(<ProfileComponent profile={emptyNameProfile} isUserSelf={false} />)
    
    expect(screen.getByTestId('profile-greeting')).toHaveTextContent('Halo, !')
  })

  it('handles empty phone number gracefully', () => {
    const emptyPhoneProfile = {
      ...mockProfile,
      user: { ...mockProfile.user, phone_number: '' },
    }
    render(<ProfileComponent profile={emptyPhoneProfile} isUserSelf={false} />)
    
    expect(screen.getByTestId('phone-number')).toHaveTextContent('')
  })
})