import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import UpdateProfileForm from '@/components/profile/UpdateProfileForm'
import { Profile } from '@/types/profile'
import * as profileApi from '@/lib/profile'

const mockSetIsModalOpen = jest.fn()
const mockUpdateProfile = jest.fn()

jest.mock('@/lib/profile', () => ({
  updateProfile: jest.fn(),
}))

const dummyProfile: Profile = {
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

describe('UpdateProfileForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form with default values', () => {
    render(
      <UpdateProfileForm profile={dummyProfile} setIsModalOpen={mockSetIsModalOpen} />
    )

    expect(screen.getByDisplayValue('Dina')).toBeInTheDocument()
    expect(screen.getByDisplayValue('Putri')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('submits valid form and closes modal on success', async () => {
    mockUpdateProfile.mockResolvedValueOnce(true)
    ;(profileApi.updateProfile as jest.Mock).mockImplementation(mockUpdateProfile)

    render(
      <UpdateProfileForm profile={dummyProfile} setIsModalOpen={mockSetIsModalOpen} />
    )

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalledWith({
        first_name: 'Dina',
        last_name: 'Putri',
      })
      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false)
    })
  })

  it('shows validation error when required fields are empty (edge case)', async () => {
    render(
      <UpdateProfileForm
        profile={{ ...dummyProfile, user: { ...dummyProfile.user, first_name: '', last_name: '' } }}
        setIsModalOpen={mockSetIsModalOpen}
      />
    )

    const firstNameInput = screen.getByPlaceholderText('Nama Depan')
    const lastNameInput = screen.getByPlaceholderText('Nama Belakang')

    fireEvent.change(firstNameInput, { target: { value: '' } })
    fireEvent.change(lastNameInput, { target: { value: '' } })

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/nama depan/i)).toBeInTheDocument()
      expect(screen.getByText(/nama belakang/i)).toBeInTheDocument()
    })
  })

  it('clicks close button and closes modal (corner case)', () => {
    render(<UpdateProfileForm profile={dummyProfile} setIsModalOpen={mockSetIsModalOpen} />)

    const closeButton = screen.getByRole('button', { name: /tutup/i })
    fireEvent.click(closeButton)

    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false)
  })

  it('does not close modal if updateProfile returns false', async () => {
    mockUpdateProfile.mockResolvedValueOnce(false)
    ;(profileApi.updateProfile as jest.Mock).mockImplementation(mockUpdateProfile)

    render(
      <UpdateProfileForm profile={dummyProfile} setIsModalOpen={mockSetIsModalOpen} />
    )

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockUpdateProfile).toHaveBeenCalled()
      expect(mockSetIsModalOpen).not.toHaveBeenCalled()
    })
  })
})
