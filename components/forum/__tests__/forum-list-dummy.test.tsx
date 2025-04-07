import { render, screen, fireEvent, within } from "@testing-library/react";
import ForumListDummy from "../ForumListDummy";
import "@testing-library/jest-dom";

describe("ForumListDummy", () => {
  it("renders list of dummy forums", () => {
    render(<ForumListDummy />);
    expect(screen.getByText(/cara budidaya lele/i)).toBeInTheDocument();
    expect(screen.getByText(/masalah air kolam/i)).toBeInTheDocument();
    expect(screen.getByText(/pakan yang efisien/i)).toBeInTheDocument();
  });

  it("opens modal and cancels deletion", () => {
    render(<ForumListDummy />);
    const firstForum = screen.getByText(/cara budidaya lele/i);
    const deleteButtons = screen.getAllByText(/hapus/i);
    fireEvent.click(deleteButtons[0]); // open modal

    expect(screen.getByText(/yakin ingin menghapus forum ini/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /batal/i }));

    expect(screen.queryByText(/yakin ingin menghapus forum ini/i)).not.toBeInTheDocument();
    expect(firstForum).toBeInTheDocument(); // forum masih ada
  });

  it("removes forum from list when confirmed", () => {
    render(<ForumListDummy />);
    
    // Klik tombol hapus pertama
    const deleteButtons = screen.getAllByText(/^hapus$/i);
    fireEvent.click(deleteButtons[0]);

    // Konfirmasi hapus di modal
    const modal = screen.getByText(/yakin ingin menghapus forum ini/i).closest("div");
    const confirmDelete = within(modal!).getByRole("button", { name: /^hapus$/i });
    fireEvent.click(confirmDelete);

    // Pastikan forum sudah hilang dari list
    expect(screen.queryByText(/cara budidaya lele/i)).not.toBeInTheDocument();
  });
});
