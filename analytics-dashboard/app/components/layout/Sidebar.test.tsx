import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createMemoryRouter, RouterProvider } from "react-router";
import { Sidebar } from "./Sidebar";

function renderSidebar(props: Partial<Parameters<typeof Sidebar>[0]> = {}, initialPath = "/") {
  const defaultProps = {
    collapsed: false,
    onToggleCollapse: jest.fn(),
    mobileOpen: false,
    onCloseMobile: jest.fn(),
    ...props,
  };

  const router = createMemoryRouter(
    [
      {
        path: "*",
        element: <Sidebar {...defaultProps} />,
      },
    ],
    { initialEntries: [initialPath] },
  );

  return { ...render(<RouterProvider router={router} />), ...defaultProps };
}

describe("Sidebar", () => {
  it("renders the brand name when expanded", () => {
    renderSidebar();
    expect(screen.getByText("Analytics")).toBeInTheDocument();
  });

  it("hides the brand name when collapsed", () => {
    renderSidebar({ collapsed: true });
    expect(screen.queryByText("Analytics")).not.toBeInTheDocument();
  });

  it("renders all nav items when expanded", () => {
    renderSidebar();
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Button")).toBeInTheDocument();
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("Textarea")).toBeInTheDocument();
    expect(screen.getByText("Input Group")).toBeInTheDocument();
    expect(screen.getByText("Card")).toBeInTheDocument();
    expect(screen.getByText("Modal")).toBeInTheDocument();
    expect(screen.getByText("Badge")).toBeInTheDocument();
  });

  it("hides nav text when collapsed", () => {
    renderSidebar({ collapsed: true });
    expect(screen.queryByText("Dashboard")).not.toBeInTheDocument();
    expect(screen.queryByText("Button")).not.toBeInTheDocument();
  });

  it("renders the Components section label when expanded", () => {
    renderSidebar();
    expect(screen.getByText("Components")).toBeInTheDocument();
  });

  it("hides the Components section label when collapsed", () => {
    renderSidebar({ collapsed: true });
    expect(screen.queryByText("Components")).not.toBeInTheDocument();
  });

  it("renders the collapse toggle button", () => {
    renderSidebar();
    expect(screen.getByLabelText("Collapse sidebar")).toBeInTheDocument();
  });

  it("calls onToggleCollapse when collapse button is clicked", async () => {
    const user = userEvent.setup();
    const { onToggleCollapse } = renderSidebar();

    await user.click(screen.getByLabelText("Collapse sidebar"));
    expect(onToggleCollapse).toHaveBeenCalledTimes(1);
  });

  it("shows expand label when collapsed", () => {
    renderSidebar({ collapsed: true });
    expect(screen.getByLabelText("Expand sidebar")).toBeInTheDocument();
  });

  it("renders the mobile overlay when mobileOpen is true", () => {
    renderSidebar({ mobileOpen: true });
    expect(screen.getByTestId("mobile-sidebar-overlay")).toBeInTheDocument();
  });

  it("does not render the mobile overlay when mobileOpen is false", () => {
    renderSidebar({ mobileOpen: false });
    expect(screen.queryByTestId("mobile-sidebar-overlay")).not.toBeInTheDocument();
  });

  it("calls onCloseMobile when mobile close button is clicked", async () => {
    const user = userEvent.setup();
    const { onCloseMobile } = renderSidebar({ mobileOpen: true });

    const overlay = screen.getByTestId("mobile-sidebar-overlay");
    const closeBtn = overlay.querySelector("[aria-label='Close sidebar']") as HTMLElement;
    await user.click(closeBtn);
    expect(onCloseMobile).toHaveBeenCalledTimes(1);
  });

  it("calls onCloseMobile when backdrop is clicked", async () => {
    const user = userEvent.setup();
    const { onCloseMobile } = renderSidebar({ mobileOpen: true });

    const backdrop = document.querySelector("[aria-hidden='true']") as HTMLElement;
    await user.click(backdrop);
    expect(onCloseMobile).toHaveBeenCalledTimes(1);
  });

  it("highlights active route for dashboard", () => {
    renderSidebar({}, "/");
    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink?.className).toContain("bg-bg-active");
  });

  it("highlights active route for component page", () => {
    renderSidebar({}, "/components/button");
    const buttonLink = screen.getByText("Button").closest("a");
    expect(buttonLink?.className).toContain("bg-bg-active");
  });

  it("does not highlight inactive routes", () => {
    renderSidebar({}, "/");
    const buttonLink = screen.getByText("Button").closest("a");
    expect(buttonLink?.className).not.toContain("bg-bg-active");
  });
});
