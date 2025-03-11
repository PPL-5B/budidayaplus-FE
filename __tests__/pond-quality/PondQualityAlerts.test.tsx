import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import PondQualityAlerts from '@/components/pond-quality/PondQualityAlerts';

const mockAlerts = [
  { parameter: "ph_level", actual_value: 6.5, target_value: 7.5, status: "Below Target" },
  { parameter: "salinity", actual_value: 20, target_value: 30, status: "Below Target" }
];

describe("PondQualityAlerts Component", () => {
  test("menampilkan notifikasi jika ada alert", () => {
    render(<PondQualityAlerts alerts={mockAlerts} />);
    
    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(screen.getByText("⚠ Peringatan Kualitas Air")).toBeInTheDocument();
    expect(screen.getByText("PH LEVEL: 6.5 (Target: 7.5) → Below Target")).toBeInTheDocument();
    expect(screen.getByText("SALINITY: 20 (Target: 30) → Below Target")).toBeInTheDocument();
  });

  test("menutup notifikasi saat tombol close diklik", async () => {
    render(<PondQualityAlerts alerts={mockAlerts} />);
    
    const closeButton = screen.getByRole("button", { name: /close/i });
    await userEvent.click(closeButton);  //Pakai userEvent.click() agar lebih realistis

    await waitFor(() => expect(screen.queryByRole("alert")).toBeNull());
  });

  test("tidak menampilkan notifikasi jika tidak ada alert", () => {
    render(<PondQualityAlerts alerts={[]} />);
    
    expect(screen.queryByRole("alert")).toBeNull();
  });
});
