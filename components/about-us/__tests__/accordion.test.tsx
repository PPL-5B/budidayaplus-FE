import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import AboutUs from "@/components/about-us/accordion";

describe("AboutUs Component", () => {
  test("judul 'Tentang Kami' muncul", () => {
    render(<AboutUs />);
    const title = screen.getByText("Tentang Kami");
    expect(title).toBeInTheDocument();
  });

  test("konten tersembunyi secara default", () => {
    render(<AboutUs />);
    const content = screen.queryByText(/BudidayaPlus adalah aplikasi/i);
    expect(content).not.toBeVisible(); // butuh jsdom >= 16
  });

  test("konten muncul setelah klik summary", () => {
    render(<AboutUs />);
    const summary = screen.getByText("Tentang Kami");
    fireEvent.click(summary);
    const content = screen.getByText(/BudidayaPlus adalah aplikasi/i);
    expect(content).toBeVisible();
  });

  test("menampilkan semua isi setelah dibuka", () => {
    render(<AboutUs />);
    fireEvent.click(screen.getByText("Tentang Kami"));

    expect(screen.getByText(/Dikembangkan oleh/i)).toBeInTheDocument();
    expect(screen.getByText(/2024/)).toBeInTheDocument();
    expect(screen.getByText(/Meningkatkan produktivitas budidaya/i)).toBeInTheDocument();
    expect(screen.getByText(/Tim BudidayaPlus/)).toBeInTheDocument();
  });
});
