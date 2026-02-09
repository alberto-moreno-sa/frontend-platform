import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { DashboardShell } from "./DashboardShell";

const mockUser = {
  id: "user-1",
  email: "test@example.com",
  name: "John Doe",
};

function renderShell(children: React.ReactNode = <div>Content</div>) {
  const router = createMemoryRouter(
    [
      {
        path: "/",
        element: <DashboardShell user={mockUser}>{children}</DashboardShell>,
      },
    ],
    { initialEntries: ["/"] },
  );

  return render(<RouterProvider router={router} />);
}

describe("DashboardShell", () => {
  it("renders the sidebar brand name", () => {
    renderShell();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("renders the Dashboard navigation item", () => {
    renderShell();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("renders component navigation items", () => {
    renderShell();
    expect(screen.getByText("Button")).toBeInTheDocument();
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(screen.getByText("Modal")).toBeInTheDocument();
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("renders the welcome message with user name", () => {
    renderShell();
    expect(screen.getByText("Welcome, John Doe")).toBeInTheDocument();
  });

  it("renders the log out button", () => {
    renderShell();
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });

  it("renders children in the main area", () => {
    renderShell(<div data-testid="test-content">Test content</div>);
    expect(screen.getByTestId("test-content")).toBeInTheDocument();
  });

  it("renders the logout form with correct action", () => {
    renderShell();
    const form = screen.getByText("Log out").closest("form");
    expect(form).toHaveAttribute("action", "/logout");
  });

  it("renders the hamburger button for mobile", () => {
    renderShell();
    expect(screen.getByLabelText("Open sidebar")).toBeInTheDocument();
  });

  it("renders the collapse toggle button", () => {
    renderShell();
    expect(screen.getByLabelText("Collapse sidebar")).toBeInTheDocument();
  });

  it("toggles sidebar collapse when clicking toggle button", async () => {
    const user = userEvent.setup();
    renderShell();

    const toggleBtn = screen.getByLabelText("Collapse sidebar");
    await user.click(toggleBtn);

    expect(screen.getByLabelText("Expand sidebar")).toBeInTheDocument();
  });
});
