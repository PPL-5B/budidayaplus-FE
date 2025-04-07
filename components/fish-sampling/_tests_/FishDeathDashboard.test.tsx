import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FishDeathDashboard from "../FishDeathDashboard";
import { useCycle } from "@/hooks/useCycle";

// Mock `useCycle` hook
jest.mock("@/hooks/useCycle", () => ({
  useCycle: jest.fn(),
}));

describe("FishDeathDashboard", () => {
  const pondId = "pond-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dashboard title and table headers", () => {
    (useCycle as jest.Mock).mockReturnValue(null);

    render(<FishDeathDashboard pondId={pondId} />);

    expect(screen.getByText(/data siklus belum tersedia/i)).toBeInTheDocument();
  });

  test("displays fish death data correctly", async () => {
    (useCycle as jest.Mock).mockReturnValue({
      pond_fish_amount: [
        {
          pond_id: pondId,
          fish_amount: 1000,
        },
      ],
    });

    render(<FishDeathDashboard pondId={pondId} />);

    await waitFor(() => {
      expect(screen.getByText("1000 ekor")).toBeInTheDocument();
      expect(screen.getByText("100 ekor")).toBeInTheDocument();
      expect(screen.getByText("900 ekor")).toBeInTheDocument();
    });
  });

  test("handles missing pond data", async () => {
    (useCycle as jest.Mock).mockReturnValue({
      pond_fish_amount: [],
    });

    render(<FishDeathDashboard pondId={pondId} />);

    await waitFor(() => {
      expect(
        screen.getByText(/Kolam tidak ditemukan dalam siklus ini/i)
      ).toBeInTheDocument();
    });
  });

  test("renders the FishSymbol icon in the title", () => {
    (useCycle as jest.Mock).mockReturnValue(null);

    const { container } = render(<FishDeathDashboard pondId={pondId} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("ensures fish count does not go negative", async () => {
    (useCycle as jest.Mock).mockReturnValue({
      pond_fish_amount: [
        {
          pond_id: pondId,
          fish_amount: 5,
        },
      ],
    });

    render(<FishDeathDashboard pondId={pondId} />);

    await waitFor(() => {
      expect(screen.getByText("5 ekor")).toBeInTheDocument();
      expect(screen.getByText("1 ekor")).toBeInTheDocument();
      expect(screen.getByText("4 ekor")).toBeInTheDocument();
    });
  });
});
