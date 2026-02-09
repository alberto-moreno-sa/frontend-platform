import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthTabSwitcher } from "./AuthTabSwitcher";

function renderWithRouter(initialEntries: string[] = ["/login"]) {
  return render(
    <MemoryRouter initialEntries={initialEntries}>
      <AuthTabSwitcher />
    </MemoryRouter>,
  );
}

describe("AuthTabSwitcher", () => {
  it("renders sign up and log in tabs", () => {
    renderWithRouter();
    expect(screen.getByText("Sign up")).toBeInTheDocument();
    expect(screen.getByText("Log in")).toBeInTheDocument();
  });

  it("links sign up tab to /register", () => {
    renderWithRouter();
    const signupLink = screen.getByText("Sign up").closest("a");
    expect(signupLink).toHaveAttribute("href", "/register");
  });

  it("links log in tab to /login", () => {
    renderWithRouter();
    const loginLink = screen.getByText("Log in").closest("a");
    expect(loginLink).toHaveAttribute("href", "/login");
  });

  it("highlights log in tab when on /login", () => {
    renderWithRouter(["/login"]);
    const loginLink = screen.getByText("Log in").closest("a");
    expect(loginLink?.className).toContain("shadow-xs");
  });

  it("highlights sign up tab when on /register", () => {
    renderWithRouter(["/register"]);
    const signupLink = screen.getByText("Sign up").closest("a");
    expect(signupLink?.className).toContain("shadow-xs");
  });
});
