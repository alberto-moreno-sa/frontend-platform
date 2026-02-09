import { render, screen } from "@testing-library/react";
import { ChartCard } from "./ChartCard";

describe("ChartCard", () => {
  it("renders the title", () => {
    render(<ChartCard title="Test Chart">content</ChartCard>);
    expect(screen.getByText("Test Chart")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<ChartCard title="Chart" description="Some description">content</ChartCard>);
    expect(screen.getByText("Some description")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<ChartCard title="Chart">content</ChartCard>);
    expect(screen.queryByText("Some description")).not.toBeInTheDocument();
  });

  it("renders children", () => {
    render(<ChartCard title="Chart"><span data-testid="child">Hello</span></ChartCard>);
    expect(screen.getByTestId("child")).toBeInTheDocument();
  });
});
