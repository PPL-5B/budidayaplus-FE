import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ReusableRegisterForm from '@/components/profile/RegisterForm'
import userEvent from '@testing-library/user-event'
import { RegisterForm as RegisterFormType } from '@/types/auth/register'

describe('ReusableRegisterForm', () => {
  const mockOnSubmit = jest.fn()
  const mockSetIsFormOpen = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders form inputs and close button', () => {
    render(<ReusableRegisterForm onSubmit={mockOnSubmit} setIsFormOpen={mockSetIsFormOpen} />)

    expect(screen.getByLabelText(/Nomor Ponsel/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nama Depan/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Nama Belakang/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /submit/i })).toBeInTheDocument()
  })

  it('calls onSubmit with form data when filled correctly', async () => {
    render(<ReusableRegisterForm onSubmit={mockOnSubmit} setIsFormOpen={mockSetIsFormOpen} />)

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Nomor Ponsel/i), '08123456789')
    await user.type(screen.getByLabelText(/Nama Depan/i), 'Ali')
    await user.type(screen.getByLabelText(/Nama Belakang/i), 'Akbar')
    await user.type(screen.getByLabelText(/Password/i), 'Password123')

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith(
        {
          phone_number: '08123456789',
          first_name: 'Ali',
          last_name: 'Akbar',
          password: 'Password123',
        },
        expect.any(Function), // reset()
        expect.any(Function)  // setError()
      )
    })
  })

  it('shows validation errors when fields are empty (edge case)', async () => {
    render(<ReusableRegisterForm onSubmit={mockOnSubmit} setIsFormOpen={mockSetIsFormOpen} />)

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Nomor Ponsel/i)).toBeInTheDocument()
      expect(screen.getByText(/Nama Depan/i)).toBeInTheDocument()
      expect(screen.getByText(/Nama Belakang/i)).toBeInTheDocument()
      expect(screen.getByText(/Password/i)).toBeInTheDocument()
    })

    expect(mockOnSubmit).not.toHaveBeenCalled()
  })

  it('calls setIsFormOpen(false) when close button is clicked', () => {
    render(<ReusableRegisterForm onSubmit={mockOnSubmit} setIsFormOpen={mockSetIsFormOpen} />)

    const closeButton = screen.getByLabelText('Tutup')
    fireEvent.click(closeButton)

    expect(mockSetIsFormOpen).toHaveBeenCalledWith(false)
  })

  it('displays error message set by setError (corner case)', async () => {
    const onSubmitWithError = async (
      _data: RegisterFormType,
      _reset: () => void,
      setError: React.Dispatch<React.SetStateAction<string | null>>
    ) => {
      setError('Nomor ponsel sudah digunakan')
    }

    render(<ReusableRegisterForm onSubmit={onSubmitWithError} setIsFormOpen={mockSetIsFormOpen} />)

    const user = userEvent.setup()

    await user.type(screen.getByLabelText(/Nomor Ponsel/i), '08123456789')
    await user.type(screen.getByLabelText(/Nama Depan/i), 'Ali')
    await user.type(screen.getByLabelText(/Nama Belakang/i), 'Akbar')
    await user.type(screen.getByLabelText(/Password/i), 'Password123')

    fireEvent.click(screen.getByRole('button', { name: /submit/i }))

    await waitFor(() => {
      expect(screen.getByText(/Nomor ponsel sudah digunakan/i)).toBeInTheDocument()
    })
  })
})
