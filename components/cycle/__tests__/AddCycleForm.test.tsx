import React from 'react'
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AddCycleForm from '@/components/cycle/AddCycleForm'
import { useToast } from '@/hooks/use-toast'
import { createCycle } from '@/lib/cycle'
import { handleDateChange, formatCycleData } from '@/components/cycle/AddCycleForm'
import { addDays } from 'date-fns'

// Mock the dependencies
jest.mock('@/hooks/use-toast')
jest.mock('@/lib/cycle')

const mockPondList = [
  {
    pond_id: 'pond1',
    name: 'Kolam A',
    length: 10,
    width: 5,
    depth: 2,
  },
  {
    pond_id: 'pond2',
    name: 'Kolam B',
    length: 8,
    width: 4,
    depth: 1.5,
  },
]

const mockSetIsModalOpen = jest.fn()
const mockToast = jest.fn()
const mockCreateCycle = createCycle as jest.MockedFunction<typeof createCycle>

beforeEach(() => {
  ;(useToast as jest.Mock).mockReturnValue({
    toast: mockToast,
  })
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('AddCycleForm', () => {
  describe('Rendering', () => {
    it('renders correctly with all fields', () => {
      render(<AddCycleForm pondList={mockPondList} setIsModalOpen={mockSetIsModalOpen} />)

      expect(screen.getByText('Mulai Siklus')).toBeInTheDocument()
      expect(screen.getByLabelText('Jumlah ikan kolam Kolam A')).toBeInTheDocument()
      expect(screen.getByLabelText('Jumlah ikan kolam Kolam B')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument()
    })

    it('renders with correct default values', () => {
      render(<AddCycleForm pondList={mockPondList} setIsModalOpen={mockSetIsModalOpen} />)

      const kolamAInput = screen.getByLabelText('Jumlah ikan kolam Kolam A') as HTMLInputElement
      const kolamBInput = screen.getByLabelText('Jumlah ikan kolam Kolam B') as HTMLInputElement

      expect(kolamAInput.value).toBe('0')
      expect(kolamBInput.value).toBe('0')
    })
  })

  describe('Form Submission', () => {
    it('submits form data correctly', async () => {
      mockCreateCycle.mockResolvedValueOnce({
        success: true,
        message: 'Cycle created successfully',
      })

      await act(async () => {
        render(<AddCycleForm pondList={mockPondList} setIsModalOpen={mockSetIsModalOpen} />)
      })

      await act(async () => {
        await userEvent.type(screen.getByLabelText('Jumlah ikan kolam Kolam A'), '100')
        await userEvent.type(screen.getByLabelText('Jumlah ikan kolam Kolam B'), '150')
        fireEvent.click(screen.getByRole('button', { name: 'Simpan' }))
      })

      await waitFor(() => {
        expect(mockCreateCycle).toHaveBeenCalledWith({
          start_date: '2025-01-01',
          end_date: expect.stringMatching(/\d{4}-\d{2}-\d{2}/), // checks for date format
          pond_fish_amount: [
            { pond_id: 'pond1', fish_amount: 100 },
            { pond_id: 'pond2', fish_amount: 150 },
          ],
        })
        expect(mockSetIsModalOpen).toHaveBeenCalledWith(false)
      })
    })

    it('handles successful submission', async () => {
      mockCreateCycle.mockResolvedValueOnce({
        success: true,
        message: 'Cycle created successfully',
      })

      await act(async () => {
        render(<AddCycleForm pondList={mockPondList} setIsModalOpen={mockSetIsModalOpen} />)
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Simpan' }))
      })

      await waitFor(() => {
        expect(mockToast).not.toHaveBeenCalled()
        expect(mockSetIsModalOpen).toHaveBeenCalledWith(false)
      })
    })

    it('handles submission error', async () => {
      mockCreateCycle.mockRejectedValueOnce(new Error('Failed to create cycle'))

      await act(async () => {
        render(<AddCycleForm pondList={mockPondList} setIsModalOpen={mockSetIsModalOpen} />)
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Simpan' }))
      })

      await waitFor(() => {
        expect(mockToast).toHaveBeenCalledWith({
          title: 'Gagal memulai siklus',
          description: 'Failed to create cycle',
          variant: 'destructive',
        })
        expect(mockSetIsModalOpen).not.toHaveBeenCalled()
      })
    })
  })

  describe('Edge Cases', () => {
    it('handles empty pond list', () => {
      render(<AddCycleForm pondList={[]} setIsModalOpen={mockSetIsModalOpen} />)

      expect(screen.queryByLabelText(/Jumlah ikan kolam/)).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: 'Simpan' })).toBeInTheDocument()
    })

    it('closes modal when close button is clicked', async () => {
      await act(async () => {
        render(<AddCycleForm pondList={mockPondList} setIsModalOpen={mockSetIsModalOpen} />)
      })

      await act(async () => {
        fireEvent.click(screen.getByRole('button', { name: 'Close' }))
      })

      expect(mockSetIsModalOpen).toHaveBeenCalledWith(false)
    })
  })

  describe('onSubmit Error Handling', () => {
    it('resets error state before submission', async () => {
      mockCreateCycle.mockResolvedValueOnce({
        success: true,
        message: 'Cycle created successfully',
      })

      await act(async () => {
        render(<AddCycleForm pondList={mockPondList} setIsModalOpen={mockSetIsModalOpen} />)
      })

      await act(async () => {
        await userEvent.type(screen.getByLabelText('Jumlah ikan kolam Kolam A'), '100')
        await userEvent.type(screen.getByLabelText('Jumlah ikan kolam Kolam B'), '150')
        fireEvent.click(screen.getByRole('button', { name: 'Simpan' }))
      })

      await waitFor(() => {
        expect(screen.queryByText('Previous error')).not.toBeInTheDocument()
      })
    })
  })
})

describe('handleDateChange', () => {
  it('updates start and end dates when date is valid', () => {
    const mockOnChange = jest.fn()
    const mockSetEndDate = jest.fn()
    const selectedDate = new Date('2025-01-01')

    handleDateChange(selectedDate, mockOnChange, mockSetEndDate)

    expect(mockOnChange).toHaveBeenCalledWith(selectedDate)
    expect(mockSetEndDate).toHaveBeenCalledWith('end_date', addDays(selectedDate, 60))
  })

  it('does nothing when selectedDate is undefined', () => {
    const mockOnChange = jest.fn()
    const mockSetEndDate = jest.fn()

    handleDateChange(undefined, mockOnChange, mockSetEndDate)

    expect(mockOnChange).not.toHaveBeenCalled()
    expect(mockSetEndDate).not.toHaveBeenCalled()
  })
})

describe('formatCycleData', () => {
  it('formats start_date and end_date as yyyy-MM-dd', () => {
    const input = {
      start_date: new Date('2025-01-01'),
      end_date: new Date('2025-03-01'),
      pond_fish_amount: [],
    }

    const result = formatCycleData(input)

    expect(result.start_date).toBe('2025-01-01')
    expect(result.end_date).toBe('2025-03-01')
  })
})

