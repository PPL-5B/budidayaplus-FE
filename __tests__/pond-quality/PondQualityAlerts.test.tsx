import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import PondAlertPopup, { AlertItem, useAlertState } from '@/components/pond-quality/PondQualityAlerts';
import { formatParameterName } from '@/components/pond-quality/utils';


// Mock Data
const mockAlerts = [
  { parameter: "ph_level", actual_value: 6.5, target_value: 7.5, status: "Below Target" },
  { parameter: "salinity", actual_value: 20, target_value: 30, status: "Below Target" }
];

describe("Utils - formatParameterName", () => {
  test("Mengubah format parameter menjadi kapital dengan spasi", () => {
    expect(formatParameterName("ph_level")).toBe("PH LEVEL");
    expect(formatParameterName("salinity")).toBe("SALINITY");
  });
});

describe("Component - AlertItem", () => {
  test("Menampilkan data alert dengan benar", () => {
    render(<AlertItem alert={mockAlerts[0]} />);

    expect(screen.getByText("PH LEVEL")).toBeInTheDocument();
    expect(screen.getByText("Actual: 6.5")).toBeInTheDocument();
    expect(screen.getByText("Target: 7.5")).toBeInTheDocument();
    expect(screen.getByText("Status: Below Target")).toBeInTheDocument();
  });
});

describe("Component - PondAlertPopup", () => {
  test("Menampilkan alert popup jika ada notifikasi", () => {
    render(<PondAlertPopup alerts={mockAlerts} />);

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("ALERT: Pond Quality Issue")).toBeInTheDocument();
    expect(screen.getByText("PH LEVEL")).toBeInTheDocument();
    expect(screen.getByText("SALINITY")).toBeInTheDocument();
  });

  test("Menutup notifikasi saat tombol close diklik", async () => {
    render(<PondAlertPopup alerts={mockAlerts} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  test("Tidak menampilkan notifikasi jika tidak ada alert", () => {
    render(<PondAlertPopup alerts={[]} />);
    
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  test("Memanggil callback onClose jika diberikan", async () => {
    const mockOnClose = jest.fn();

    render(<PondAlertPopup alerts={mockAlerts} onClose={mockOnClose} />);

    const closeButton = screen.getByRole("button", { name: /close/i });
    fireEvent.click(closeButton);

    await waitFor(() => expect(mockOnClose).toHaveBeenCalledTimes(1));
  });
});

describe("Hook - useAlertState", () => {
  test("State terbuka jika ada alert", () => {
    let state = useAlertState(mockAlerts);
    expect(state.open).toBe(true);
  });

  test("State tertutup jika tidak ada alert", () => {
    let state = useAlertState([]);
    expect(state.open).toBe(false);
  });

  test("State berubah jika alerts berubah", () => {
    const { open, setOpen } = useAlertState([]);

    act(() => {
      setOpen(true);
    });

    expect(open).toBe(true);
  });
});
