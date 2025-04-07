import { render, screen, fireEvent } from "@testing-library/react";
import DeleteForumModal from "@/components/forum/DeleteForumModal";
import "@testing-library/jest-dom";


describe("DeleteForumModal", () => {
  const onClose = jest.fn();
  const onDelete = jest.fn();
  const forumTitle = "Forum Keren";

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders modal with correct content", () => {
    render(
      <DeleteForumModal
        forumTitle={forumTitle}
        onClose={onClose}
        onDelete={onDelete}
      />
    );

    expect(
      screen.getByText(`Apakah kamu yakin ingin menghapus forum "${forumTitle}"?`)
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /hapus/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /batal/i })).toBeInTheDocument();
  });

  it("calls onDelete when delete button is clicked", () => {
    render(
      <DeleteForumModal
        forumTitle={forumTitle}
        onClose={onClose}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /hapus/i }));
    expect(onDelete).toHaveBeenCalled();
  });

  it("calls onClose when cancel button is clicked", () => {
    render(
      <DeleteForumModal
        forumTitle={forumTitle}
        onClose={onClose}
        onDelete={onDelete}
      />
    );

    fireEvent.click(screen.getByRole("button", { name: /batal/i }));
    expect(onClose).toHaveBeenCalled();
  });

  it("disables delete button and shows loading text when loading is true", () => {
    render(
      <DeleteForumModal
        forumTitle={forumTitle}
        onClose={onClose}
        onDelete={onDelete}
        loading={true}
      />
    );
  
    const deleteButton = screen.getByRole("button", { name: /menghapus/i });
    expect(deleteButton).toBeDisabled();
    expect(deleteButton).toHaveTextContent("Menghapus...");
  });
  
});
