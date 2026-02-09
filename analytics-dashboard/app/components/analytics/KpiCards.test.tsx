import { render, screen } from "@testing-library/react";
import { KpiCards } from "./KpiCards";
import type { StatsSummary } from "~/lib/tracking-types";

const mockSummary: StatsSummary = {
  totalInteractions: 1234,
  uniqueSessions: 56,
  interactionsLast24h: 789,
  interactionsLastHour: 42,
  avgInteractionsPerSession: 22.03,
};

describe("KpiCards", () => {
  it("renders all 5 KPI labels", () => {
    render(<KpiCards summary={mockSummary} />);
    expect(screen.getByText("Total Interactions")).toBeInTheDocument();
    expect(screen.getByText("Unique Sessions")).toBeInTheDocument();
    expect(screen.getByText("Last 24h")).toBeInTheDocument();
    expect(screen.getByText("Last Hour")).toBeInTheDocument();
    expect(screen.getByText("Avg / Session")).toBeInTheDocument();
  });

  it("renders formatted values", () => {
    render(<KpiCards summary={mockSummary} />);
    expect(screen.getByText("1.2k")).toBeInTheDocument();
    expect(screen.getByText("56")).toBeInTheDocument();
    expect(screen.getByText("42")).toBeInTheDocument();
  });

  it("renders zero values without crashing", () => {
    const zeroSummary: StatsSummary = {
      totalInteractions: 0,
      uniqueSessions: 0,
      interactionsLast24h: 0,
      interactionsLastHour: 0,
      avgInteractionsPerSession: 0,
    };
    render(<KpiCards summary={zeroSummary} />);
    expect(screen.getAllByText("0")).toHaveLength(5);
  });
});
