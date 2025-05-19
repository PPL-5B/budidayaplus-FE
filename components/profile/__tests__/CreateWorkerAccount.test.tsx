import React from 'react'
import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import CreateWorkerAccount from '@/components/profile/CreateWorkerAccount'
import { createWorker } from '@/lib/profile'
import { RegisterForm } from '@/types/auth/register'

// Mock dependencies
jest.mock('@/components/profile', () => ({
  ReusableRegisterForm: jest.fn(() => <div data-testid="register-form">Mocked Register Form</div>)
}))
jest.mock('@/lib/profile', () => ({
  createWorker: jest.fn()
}))

describe('CreateWorkerAccount', () => {
  const mockProps = {
    'data-testid': 'test-container'
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders correctly with the trigger button', () => {
    render(<CreateWorkerAccount {...mockProps} />)
    expect(screen.getByTestId('test-container')).toBeInTheDocument()
    expect(screen.getByTestId('open-dialog-button')).toBeInTheDocument()
    expect(screen.getByTestId('add-icon')).toBeInTheDocument()
    expect(screen.getByTestId('open-dialog-button')).toHaveTextContent('Daftarkan Pekerja')
  })

  it('opens dialog when button is clicked', () => {
    render(<CreateWorkerAccount {...mockProps} />)
    fireEvent.click(screen.getByTestId('open-dialog-button'))
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
  })

  it('renders ReusableRegisterForm with correct props', () => {
    render(<CreateWorkerAccount {...mockProps} />)
    fireEvent.click(screen.getByTestId('open-dialog-button'))

    const formProps: {
      onSubmit: (
        data: RegisterForm,
        reset: () => void,
        setError: React.Dispatch<React.SetStateAction<string | null>>
      ) => Promise<void>
      setIsFormOpen: React.Dispatch<React.SetStateAction<boolean>>
    } = (require('@/components/profile').ReusableRegisterForm as jest.Mock).mock.calls[0][0]

    expect(formProps.onSubmit).toBeDefined()
    expect(formProps.setIsFormOpen).toBeDefined()
  })

  it('closes dialog when form submission is successful', async () => {
    (createWorker as jest.Mock).mockResolvedValue({ data: true })

    render(<CreateWorkerAccount {...mockProps} />)
    fireEvent.click(screen.getByTestId('open-dialog-button'))

    const formProps = (require('@/components/profile').ReusableRegisterForm as jest.Mock).mock.calls[0][0]

    const mockReset = jest.fn(() => {})
    const mockSetError: React.Dispatch<React.SetStateAction<string | null>> = jest.fn()

    await formProps.onSubmit({} as RegisterForm, mockReset, mockSetError)

    await waitFor(() => {
      expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
    })

    expect(mockReset).toHaveBeenCalled()
    expect(mockSetError).not.toHaveBeenCalled()
  })

  it('sets error when form submission fails', async () => {
    const mockError = 'Registration failed'
    ;(createWorker as jest.Mock).mockResolvedValue({ error: mockError })

    render(<CreateWorkerAccount {...mockProps} />)
    fireEvent.click(screen.getByTestId('open-dialog-button'))

    const formProps = (require('@/components/profile').ReusableRegisterForm as jest.Mock).mock.calls[0][0]

    const mockReset = jest.fn()
    const mockSetError: React.Dispatch<React.SetStateAction<string | null>> = jest.fn()

    await formProps.onSubmit({} as RegisterForm, mockReset, mockSetError)

    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()
    expect(mockReset).not.toHaveBeenCalled()
    expect(mockSetError).toHaveBeenCalledWith(mockError)
  })

  it('sets error when form submission fails with undefined error', async () => {
    (createWorker as jest.Mock).mockResolvedValue({})

    render(<CreateWorkerAccount {...mockProps} />)
    fireEvent.click(screen.getByTestId('open-dialog-button'))

    const formProps = (require('@/components/profile').ReusableRegisterForm as jest.Mock).mock.calls[0][0]

    const mockReset = jest.fn()
    const mockSetError: React.Dispatch<React.SetStateAction<string | null>> = jest.fn()

    await formProps.onSubmit({} as RegisterForm, mockReset, mockSetError)

    expect(mockSetError).toHaveBeenCalledWith(undefined)
  })

  it('can close dialog by calling setIsFormOpen(false)', () => {
    render(<CreateWorkerAccount {...mockProps} />)
    fireEvent.click(screen.getByTestId('open-dialog-button'))

    const formProps = (require('@/components/profile').ReusableRegisterForm as jest.Mock).mock.calls[0][0]
    expect(screen.getByTestId('dialog-content')).toBeInTheDocument()

    formProps.setIsFormOpen(false)

    expect(screen.queryByTestId('dialog-content')).not.toBeInTheDocument()
  })

  it('dialog content has correct styling classes', () => {
    render(<CreateWorkerAccount {...mockProps} />)
    fireEvent.click(screen.getByTestId('open-dialog-button'))

    const dialogContent = screen.getByTestId('dialog-content')
    expect(dialogContent).toHaveClass('w-[350px]')
    expect(dialogContent).toHaveClass('max-w-xl')
    expect(dialogContent).toHaveClass('p-0')
    expect(dialogContent).toHaveClass('bg-transparent')
    expect(dialogContent).toHaveClass('shadow-none')
    expect(dialogContent).toHaveClass('[&>button]:hidden')
  })
})
