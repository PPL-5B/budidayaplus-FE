import { render, screen, fireEvent } from "@testing-library/react";
import ForumButton from "../ForumButton";
import { useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";

// Mock useUser dan useRouter
jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

jest.mock("@/hooks/useUser", () => ({
  useUser: jest.fn(),
}));

describe("ForumButton", () => {
  const useRouterMock = useRouter as jest.Mock;
  const useUserMock = useUser as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("navigates to /forum when user exists", () => {
    const pushMock = jest.fn();
    useRouterMock.mockReturnValue({ push: pushMock });
    useUserMock.mockReturnValue({ phone_number: "08123456789" });

    render(<ForumButton />);
    const button = screen.getByRole("button", { name: /ke forum/i });

    fireEvent.click(button);

    expect(pushMock).toHaveBeenCalledWith("/forum");
  });

  it("does not render button when user is null", () => {
    useUserMock.mockReturnValue(null);

    render(<ForumButton />);
    const button = screen.queryByRole("button", { name: /ke forum/i });

    expect(button).not.toBeInTheDocument();
  });
});
