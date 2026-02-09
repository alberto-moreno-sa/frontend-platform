import React from "react";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

describe("Badge", () => {
  it("renders with text content", () => {
    render(<Badge>New</Badge>);
    expect(screen.getByText("New")).toBeInTheDocument();
  });

  it("applies default intent classes", () => {
    render(<Badge>Default</Badge>);
    const badge = screen.getByText("Default");
    expect(badge.className).toContain("bg-primary");
    expect(badge.className).toContain("text-primary-foreground");
  });

  it("applies secondary intent", () => {
    render(<Badge intent="secondary">Secondary</Badge>);
    expect(screen.getByText("Secondary").className).toContain("bg-secondary");
  });

  it("applies destructive intent", () => {
    render(<Badge intent="destructive">Error</Badge>);
    expect(screen.getByText("Error").className).toContain("bg-destructive");
  });

  it("applies outline intent", () => {
    render(<Badge intent="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("bg-transparent");
    expect(badge.className).toContain("border-border");
  });

  it("applies success intent", () => {
    render(<Badge intent="success">Active</Badge>);
    expect(screen.getByText("Active").className).toContain("bg-success");
  });

  it("applies warning intent", () => {
    render(<Badge intent="warning">Pending</Badge>);
    expect(screen.getByText("Pending").className).toContain("bg-warning");
  });

  it("applies size variants", () => {
    const { rerender } = render(<Badge size="small">Small</Badge>);
    expect(screen.getByText("Small").className).toContain("px-2");

    rerender(<Badge size="large">Large</Badge>);
    expect(screen.getByText("Large").className).toContain("px-3");
  });

  it("merges custom className", () => {
    render(<Badge className="ml-2">Custom</Badge>);
    const badge = screen.getByText("Custom");
    expect(badge.className).toContain("ml-2");
    expect(badge.className).toContain("bg-primary");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<Badge ref={ref}>Ref</Badge>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });

  it("passes HTML attributes", () => {
    render(<Badge data-testid="my-badge">Badge</Badge>);
    expect(screen.getByTestId("my-badge")).toBeInTheDocument();
  });
});
