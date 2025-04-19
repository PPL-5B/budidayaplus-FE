import { render, screen } from "@testing-library/react";
import NotFoundPage from "@/app/not-found";
import '@testing-library/jest-dom';

jest.mock("next/image", () => ({
  __esModule: true,
  default: (props: any) => {
    return (
      <img
        {...props}
        data-testid="mocked-image"
        alt={props.alt ?? "no alt"}
        src={props.src ?? "fallback.png"}
      />
    );
  },
}));

describe("NotFoundPage (with edge cases)", () => {
  it("renders with missing image src (edge case)", () => {
    render(<NotFoundPage />);
    const image = screen.getByTestId("mocked-image");
    expect(image).toBeInTheDocument();
    expect(image.getAttribute("src")).toContain("broken-phone-in-two-parts.svg"); // src masih ada
  });
});

describe("NotFoundPage", () => {
  it("renders title and message (positive case)", () => {
    render(<NotFoundPage />);
    expect(screen.getByText("Halaman Tidak Ditemukan!")).toBeInTheDocument();
    expect(screen.getByText(/tidak tersedia atau sudah dipindahkan/i)).toBeInTheDocument();
  });

  it("does not show unrelated text (negative case)", () => {
    render(<NotFoundPage />);
    expect(screen.queryByText("Halaman Berhasil!")).not.toBeInTheDocument();
  });
});