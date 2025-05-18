import Home from "@/app/page"
import { render, screen } from "@testing-library/react"

// Mock komponen Cycle agar tidak tergantung implementasi aslinya
jest.mock('@/components/cycle', () => ({
  Cycle: () => <div data-testid="cycleList" />
}))

// Mock komponen TaskByDateList juga jika ingin tes stabil
jest.mock('@/components/tasks/TaskByDateList', () => ({
  TaskByDateList: () => <div data-testid="taskList" />
}))

describe("Home Page", () => {
  test("menampilkan heading BudidayaPlus dan komponen utama", () => {
    render(<Home />)

    // Cek heading utama
    expect(screen.getByText("Welcome to")).toBeInTheDocument()
    expect(screen.getByText("BudidayaPlus")).toBeInTheDocument()

    // Komponen cycle & task list tampil
    expect(screen.getByTestId("cycleList")).toBeInTheDocument()
    expect(screen.getByTestId("taskList")).toBeInTheDocument()

    // Cek bagian 'Tugas Hari Ini'
    expect(screen.getByText("Tugas Hari Ini")).toBeInTheDocument()

    // Cek bagian 'Tentang Kami' muncul sebagai tombol summary
    expect(screen.getByText("Tentang Kami")).toBeInTheDocument()
  })
})
