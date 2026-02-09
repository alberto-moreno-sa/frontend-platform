import { render, screen } from "@testing-library/react";
import { ActionPieChart } from "./ActionPieChart";

describe("ActionPieChart", () => {
  it("renders the chart card with title", () => {
    render(<ActionPieChart data={{ click: 10, hover: 5 }} />);
    expect(screen.getByText("By Action")).toBeInTheDocument();
  });

  it("renders recharts PieChart mock", () => {
    render(<ActionPieChart data={{ click: 10 }} />);
    expect(screen.getByTestId("recharts-PieChart")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<ActionPieChart data={{}} />);
    expect(screen.getByText("By Action")).toBeInTheDocument();
  });
});
