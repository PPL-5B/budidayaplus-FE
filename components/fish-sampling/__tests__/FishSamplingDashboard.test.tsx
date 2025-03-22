import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import FishSamplingDashboard from "../FishSamplingDashboard";
import { useLatestFishSampling } from "@/hooks/useFishSampling";

// Mock `useLatestFishSampling` hook
jest.mock("@/hooks/useFishSampling", () => ({
  useLatestFishSampling: jest.fn(),
}));

describe("FishSamplingDashboard", () => {
  const pondId = "pond-123";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders dashboard title and table headers", () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue(null);

    render(<FishSamplingDashboard pondId={pondId} />);

    expect(screen.getByText(/dashboard sampling ikan terbaru/i)).toBeInTheDocument();
    expect(screen.getByText(/parameter/i)).toBeInTheDocument();
    expect(screen.getByText(/nilai aktual/i)).toBeInTheDocument();
    expect(screen.getByText(/nilai target/i)).toBeInTheDocument();
  });

  test("displays fish sampling data correctly", async () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue({
      fish_weight: 2.8,
      fish_length: 42,
    });

    render(<FishSamplingDashboard pondId={pondId} />);

    await waitFor(() => {
      expect(screen.getByText("2.8")).toBeInTheDocument();
      expect(screen.getByText("42")).toBeInTheDocument();
    });

    // Verifying target values
    expect(screen.getByText("2.5")).toBeInTheDocument();
    expect(screen.getByText("40")).toBeInTheDocument();
  });

  test("handles missing fish sampling data", async () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue({
      fish_weight: null,
      fish_length: undefined,
    });

    render(<FishSamplingDashboard pondId={pondId} />);

    await waitFor(() => {
      expect(screen.getAllByText("N/A").length).toBeGreaterThanOrEqual(1);
    });
  });

  test("renders the Waves icon in the title", () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue(null);

    const { container } = render(<FishSamplingDashboard pondId={pondId} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  test("applies red text style when fish weight is below target", async () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue({
      fish_weight: 2.0, // Below target 2.5
      fish_length: 42,
    });

    render(<FishSamplingDashboard pondId={pondId} />);

    await waitFor(() => {
      const weightCell = screen.getByText("2.0");
      expect(weightCell).toHaveClass("text-red-500");
    });
  });

  test("applies red text style when fish length is below target", async () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue({
      fish_weight: 2.8,
      fish_length: 35, // Below target 40
    });

    render(<FishSamplingDashboard pondId={pondId} />);

    await waitFor(() => {
      const lengthCell = screen.getByText("35");
      expect(lengthCell).toHaveClass("text-red-500");
    });
  });

  test("shows 'Data belum tersedia' when fish sampling data is empty", async () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue({
      fish_weight: null,
      fish_length: null,
    });
  
    render(<FishSamplingDashboard pondId={pondId} />);
  
    await waitFor(() => {
      expect(
        screen.getByText(/Data belum tersedia, silakan isi data terlebih dahulu/i)
      ).toBeInTheDocument();
    });
  });

  test("does not apply red text when fish weight and length meet or exceed target", async () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue({
      fish_weight: 2.5, 
      fish_length: 40, 
    });

    render(<FishSamplingDashboard pondId={pondId} />);

    await waitFor(() => {
      const weightCell = screen.getByText("2.5");
      const lengthCell = screen.getByText("40");

      expect(weightCell).not.toHaveClass("text-red-500");
      expect(lengthCell).not.toHaveClass("text-red-500");
    });
  });
});
