import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";

jest.mock("@/lib/forum/deleteForumById", () => ({
  deleteForumById: jest.fn(),
}));

import { deleteForumById } from "@/lib/forum/deleteForumById";
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
    render(
      <DeleteForumContainer
        forumId={forumId}
        forumTitle="Forum Uji"
        isOpen={false}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    expect(
      screen.queryByText(/apakah kamu yakin ingin menghapus forum/i)
    ).not.toBeInTheDocument();
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

  it("handles error when deleteForumById throws", async () => {
    (deleteForumById as jest.Mock).mockRejectedValueOnce(new Error("Delete failed"));

    const consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});

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
      expect(console.error).toHaveBeenCalledWith("Error:", expect.any(Error));
      expect(onSuccess).not.toHaveBeenCalled();
      expect(onClose).toHaveBeenCalled(); // tetap dipanggil meskipun gagal
    });

    consoleErrorSpy.mockRestore();
  });
});
