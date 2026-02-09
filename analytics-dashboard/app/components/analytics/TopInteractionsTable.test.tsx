import { render, screen } from "@testing-library/react";
import { TopInteractionsTable } from "./TopInteractionsTable";
import type { TopInteraction } from "~/lib/tracking-types";

const mockData: TopInteraction[] = [
  { componentName: "Button", variant: "primary", action: "click", pageUrl: "/", count: 100 },
  { componentName: "Input", variant: "default", action: "focus", pageUrl: "/form", count: 50 },
];

describe("TopInteractionsTable", () => {
  it("renders table headers", () => {
    render(<TopInteractionsTable data={mockData} />);
    expect(screen.getByText("Component")).toBeInTheDocument();
    expect(screen.getByText("Variant")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
    expect(screen.getByText("Count")).toBeInTheDocument();
  });

  it("renders data rows", () => {
    render(<TopInteractionsTable data={mockData} />);
    expect(screen.getByText("Button")).toBeInTheDocument();
    expect(screen.getByText("primary")).toBeInTheDocument();
    expect(screen.getByText("100")).toBeInTheDocument();
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("50")).toBeInTheDocument();
  });

  it("renders empty state when no data", () => {
    render(<TopInteractionsTable data={[]} />);
    expect(screen.getByText("No interactions recorded yet.")).toBeInTheDocument();
  });
});
