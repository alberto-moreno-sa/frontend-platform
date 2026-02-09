import { render, screen } from "@testing-library/react";
import { TimelineChart } from "./TimelineChart";

describe("TimelineChart", () => {
  it("renders the chart card with title", () => {
    render(<TimelineChart data={[]} />);
    expect(screen.getByText("Interactions Timeline")).toBeInTheDocument();
  });

  it("renders recharts AreaChart mock", () => {
    render(<TimelineChart data={[{ hour: "2026-01-01T10:00:00Z", count: 5 }]} />);
    expect(screen.getByTestId("recharts-AreaChart")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<TimelineChart data={[]} />);
    expect(screen.getByTestId("recharts-AreaChart")).toBeInTheDocument();
  });
});
