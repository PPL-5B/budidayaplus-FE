import { render, screen } from "@testing-library/react";
import DetailArtikel from "@/components/artikel/DetailArtikel"; 

describe("DetailArtikel component", () => {
  const mockArticle = {
    title: "Belajar Budidaya Lele",
    author: "Hana",
    date: "17 April 2025",
    synopsis: "Ini adalah sinopsis pendek yang menjelaskan isi artikel secara singkat.",
    categories: ["Teknik Budidaya", "Nutrisi Pakan"]
  };

  it("menampilkan judul artikel", () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText("Belajar Budidaya Lele")).toBeInTheDocument();
  });

  it("menampilkan nama penulis dan tanggal", () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText(/Oleh: Hana/)).toBeInTheDocument();
    expect(screen.getByText(/17 April 2025/)).toBeInTheDocument();
  });

  it("menghitung dan menampilkan estimasi waktu baca", () => {
    render(<DetailArtikel article={mockArticle} />);
    const wordCount = mockArticle.synopsis.split(" ").length;
    const estimatedTime = Math.ceil(wordCount / 200);
    expect(screen.getByText(new RegExp(`${estimatedTime} menit untuk membaca`))).toBeInTheDocument();
  });

  it("menampilkan semua kategori yang dikenal dengan warna yang sesuai", () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText("Teknik Budidaya")).toHaveClass("bg-amber-600");
    expect(screen.getByText("Nutrisi Pakan")).toHaveClass("bg-red-800");
  });

  it("menampilkan sinopsis artikel", () => {
    render(<DetailArtikel article={mockArticle} />);
    expect(screen.getByText(mockArticle.synopsis)).toBeInTheDocument();
  });

  it("menampilkan fallback warna abu untuk kategori yang tidak dikenal", () => {
    const unknownCategoryArticle = {
      ...mockArticle,
      categories: ["Kategori Tidak Dikenal"]
    };
    render(<DetailArtikel article={unknownCategoryArticle} />);
    const categoryElement = screen.getByText("Kategori Tidak Dikenal");
    expect(categoryElement).toHaveClass("bg-gray-500");
  });

  it("handle edge case: artikel tanpa kategori", () => {
    const noCategoryArticle = {
      ...mockArticle,
      categories: []
    };
    render(<DetailArtikel article={noCategoryArticle} />);
    expect(screen.queryByRole("span")).not.toBeInTheDocument();
  });

  it("artikel dengan synopsis kosong", () => {
    const emptySynopsisArticle = {
      ...mockArticle,
      synopsis: ""
    };
    render(<DetailArtikel article={emptySynopsisArticle} />);
    expect(screen.getByText((content) => content.includes("1 menit untuk membaca"))).toBeInTheDocument();
  });
  
});
