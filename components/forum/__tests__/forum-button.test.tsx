import { render, screen, fireEvent } from "@testing-library/react";
import ForumButton from "../ForumButton";
import { useRouter } from "next/navigation";

// Mock useUser dan useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

describe("ForumButton", () => {
  it("navigates to /forum when user exists", () => {
    const pushMock = jest.fn();
    const useRouterMock = useRouter as jest.Mock;
    const { useUser } = require("@/hooks/useUser");

    useRouterMock.mockReturnValue({ push: pushMock });
    useUser.mockReturnValue({ phone_number: "08123456789" }); // bebas, cuma buat lulus if

    render(<ForumButton />);
    const button = screen.getByRole("button", { name: /ke forum/i });

    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/forum");
  });

  it("does not render button when user is null", () => {
    const { useUser } = require("@/hooks/useUser");
    useUser.mockReturnValue(null);

    render(<ForumButton />);
    const button = screen.queryByRole("button", { name: /ke forum/i });

    expect(button).not.toBeInTheDocument();
  });
});
