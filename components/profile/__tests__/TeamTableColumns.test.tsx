import React from 'react'
import { render, screen } from '@testing-library/react'
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table'
import { columns } from '@/components/profile/TeamTableColumns'
import { Profile } from '@/types/profile'

const mockData: Profile[] = [
  {
    id: 1,
    role: 'worker',
    image_name: '',
    user: {
      id: 10,
      first_name: 'Ali',
      last_name: 'Akbar',
      phone_number: '08123456789',
    },
  },
  {
    id: 2,
    role: 'admin' as unknown as Profile['role'],
    image_name: '',
    user: {
      id: 11,
      first_name: 'Budi',
      last_name: '',
      phone_number: '08234567890',
    },
  },
]

function TestTable() {
  const table = useReactTable({
    data: mockData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

describe('TeamTableColumns config', () => {
  it('renders name, phone, and role correctly', () => {
    render(<TestTable />)

    expect(screen.getByText('Ali Akbar')).toBeInTheDocument()
    expect(screen.getByText('Budi')).toBeInTheDocument()

    expect(screen.getByText('08123456789')).toBeInTheDocument()
    expect(screen.getByText('08234567890')).toBeInTheDocument()

    expect(screen.getByText('Worker')).toBeInTheDocument()
    expect(screen.getByText('Admin')).toBeInTheDocument()
  })
})
