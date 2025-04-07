import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DeleteForumContainer from "../DeleteForumContainer";
import "@testing-library/jest-dom";

// Mock fetch
global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({ message: "Forum deleted." }),
  })
) as jest.Mock;

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

  it("calls fetch, onSuccess, and onClose when delete confirmed", async () => {
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
      expect(fetch).toHaveBeenCalledWith(`/api/forum/delete/${forumId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

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
});
