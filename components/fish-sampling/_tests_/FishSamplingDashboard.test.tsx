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

  test("shows loading state when data is not available", () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue(null);

    render(<FishSamplingDashboard pondId={pondId} />);

    expect(screen.getByText(/loading data.../i)).toBeInTheDocument();
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
      expect(screen.getByText("N/A")).toBeInTheDocument();
    });
  });

  test("renders the Waves icon in the title", () => {
    (useLatestFishSampling as jest.Mock).mockReturnValue(null);

    const { container } = render(<FishSamplingDashboard pondId={pondId} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});
