import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import UpdateProfileModal from '@/components/profile/UpdateProfileModal'
import { Profile } from '@/types/profile'

jest.mock('@/components/profile/UpdateProfileForm', () => {
  type Props = {
    profile: {
      id: number
      role: string
      image_name: string
      user: {
        id: number
        first_name: string
        last_name: string
        phone_number: string
      }
    }
    setIsModalOpen: (open: boolean) => void
  }

  const MockUpdateProfileForm: React.FC<Props> = ({ setIsModalOpen }) => (
    <div data-testid="mock-update-form">
      <button data-testid="mock-close-button" onClick={() => setIsModalOpen(false)}>Close Form</button>
      <p>Form is rendered</p>
    </div>
  )

  return {
    __esModule: true,
    default: MockUpdateProfileForm,
  }
})

jest.mock('@radix-ui/react-dialog', () => {
  const originalModule = jest.requireActual('@radix-ui/react-dialog')

  return {
    ...originalModule,
    Title: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => <h2 {...props}>{children || 'Dialog Title'}</h2>,
    Description: (props: React.HTMLAttributes<HTMLParagraphElement>) => <p {...props} />,
  }
})

const dummyProfile: Profile = {
  id: 1,
  role: 'worker',
  image_name: 'default.jpg',
  user: {
    id: 123,
    first_name: 'Dina',
    last_name: 'Putri',
    phone_number: '081234567890',
  },
}

describe('UpdateProfileModal', () => {
  it('should not show modal content initially', () => {
    render(
      <UpdateProfileModal profile={dummyProfile}>
        <button>Open Modal</button>
      </UpdateProfileModal>
    )

    expect(screen.queryByText('Form is rendered')).not.toBeInTheDocument()
  })

  it('should show modal content when trigger is clicked', () => {
    render(
      <UpdateProfileModal profile={dummyProfile}>
        <button>Open Modal</button>
      </UpdateProfileModal>
    )

    fireEvent.click(screen.getByText('Open Modal'))
    expect(screen.getByText('Form is rendered')).toBeInTheDocument()
  })

  it('should close modal when setIsModalOpen is called from form', () => {
    render(
      <UpdateProfileModal profile={dummyProfile}>
        <button>Open Modal</button>
      </UpdateProfileModal>
    )

    fireEvent.click(screen.getByText('Open Modal'))
    fireEvent.click(screen.getByTestId('mock-close-button'))

    expect(screen.queryByText('Form is rendered')).not.toBeInTheDocument()
  })

  it('should render gracefully with null children (edge case)', () => {
    render(<UpdateProfileModal profile={dummyProfile}>{null}</UpdateProfileModal>)
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })

  it('should handle empty profile fields (corner case)', () => {
    const emptyProfile: Profile = {
      id: 0,
      role: 'worker',
      image_name: '',
      user: {
        id: 0,
        first_name: '',
        last_name: '',
        phone_number: '',
      },
    }

    render(
      <UpdateProfileModal profile={emptyProfile}>
        <button>Open Modal</button>
      </UpdateProfileModal>
    )

    fireEvent.click(screen.getByText('Open Modal'))
    expect(screen.getByTestId('mock-update-form')).toBeInTheDocument()
  })
})
