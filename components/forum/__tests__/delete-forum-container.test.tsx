
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/lib/forum/deleteForumById", () => ({
  deleteForumById: jest.fn(),
}));

import { deleteForumById } from "@/lib/forum/delete";
import DeleteForumContainer from "../DeleteForumContainer";

describe("DeleteForumContainer", () => {
  const forumId = "123";
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal when isOpen is true", () => {
    render(
      <DeleteForumContainer
        forumId={forumId}
        forumTitle="Forum Uji"
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    expect(
      screen.getByText(/apakah kamu yakin ingin menghapus forum/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/forum uji/i)).toBeInTheDocument();
  });

  it("does not render modal when isOpen is false", () => {
    const { container } = render(
      <DeleteForumContainer
        forumId={forumId}
        forumTitle="Forum Uji"
        isOpen={false}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    expect(container.firstChild).toBeNull();
  });

  it("calls deleteForumById, onSuccess, and onClose when delete confirmed", async () => {
    (deleteForumById as jest.Mock).mockResolvedValueOnce({ message: "Deleted" });

    render(
      <DeleteForumContainer
        forumId={forumId}
        forumTitle="Forum Uji"
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /hapus/i }));

    await waitFor(() => {
      expect(deleteForumById).toHaveBeenCalledWith(forumId);
      expect(onSuccess).toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled();
    });
  });

  it("calls onClose when cancel is clicked", () => {
    render(
      <DeleteForumContainer
        forumId={forumId}
        forumTitle="Forum Uji"
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );
    fireEvent.click(screen.getByRole("button", { name: /batal/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("handles error and still calls onSuccess and onClose (fallback visual delete)", async () => {
    (deleteForumById as jest.Mock).mockRejectedValueOnce(new Error("Simulated error"));
    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

    render(
      <DeleteForumContainer
        forumId="error-id"
        forumTitle="Error Forum"
        isOpen={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /hapus/i }));

    await waitFor(() => {
      expect(deleteForumById).toHaveBeenCalledWith("error-id");
      expect(console.error).toHaveBeenCalled();
      expect(onSuccess).toHaveBeenCalled(); // fallback success
      expect(onClose).toHaveBeenCalled();   // modal tetap ditutup
    });

    consoleErrorSpy.mockRestore();
  });
});
