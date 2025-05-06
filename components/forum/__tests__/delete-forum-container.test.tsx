import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import * as forumLib from "@/lib/forum/delete";
import DeleteForumContainer from "../DeleteForumContainer";

jest.mock("@/lib/forum/delete", () => ({
  deleteForumById: jest.fn(),
}));

describe("DeleteForumContainer", () => {
  const mockOnClose = jest.fn();
  const mockOnSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should not render modal when isOpen is false", () => {
    render(
      <DeleteForumContainer
        forumId="123"
        isOpen={false}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );
    expect(screen.queryByText(/hapus forum/i)).not.toBeInTheDocument();
  });

  it("should render and call delete and callbacks on success", async () => {
    (forumLib.deleteForumById as jest.Mock).mockResolvedValueOnce({});
    
    render(
      <DeleteForumContainer
        forumId="123"
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /hapus/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(forumLib.deleteForumById).toHaveBeenCalledWith("123");
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it("should call callbacks even when delete fails", async () => {
    (forumLib.deleteForumById as jest.Mock).mockRejectedValueOnce(new Error("fail"));

    render(
      <DeleteForumContainer
        forumId="123"
        isOpen={true}
        onClose={mockOnClose}
        onSuccess={mockOnSuccess}
      />
    );

    const deleteButton = screen.getByRole("button", { name: /hapus/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(forumLib.deleteForumById).toHaveBeenCalledWith("123");
      expect(mockOnSuccess).toHaveBeenCalled();
      expect(mockOnClose).toHaveBeenCalled();
    });
  });
});
