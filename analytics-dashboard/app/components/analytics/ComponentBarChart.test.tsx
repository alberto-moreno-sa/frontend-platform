import { render, screen } from "@testing-library/react";
import { ComponentBarChart } from "./ComponentBarChart";

describe("ComponentBarChart", () => {
  it("renders the chart card with title", () => {
    render(<ComponentBarChart data={[]} />);
    expect(screen.getByText("By Component")).toBeInTheDocument();
  });

  it("renders recharts BarChart mock", () => {
    render(<ComponentBarChart data={[{ componentName: "Button", total: 10, variants: [] }]} />);
    expect(screen.getByTestId("recharts-BarChart")).toBeInTheDocument();
  });

  it("renders with empty data", () => {
    render(<ComponentBarChart data={[]} />);
    expect(screen.getByTestId("recharts-BarChart")).toBeInTheDocument();
  });
});
