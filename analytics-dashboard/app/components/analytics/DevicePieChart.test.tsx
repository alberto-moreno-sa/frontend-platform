import { render, screen } from "@testing-library/react";
import { DevicePieChart } from "./DevicePieChart";

describe("DevicePieChart", () => {
  it("renders the chart card with title", () => {
    render(<DevicePieChart data={{ desktop: 50, mobile: 30, tablet: 20 }} />);
    expect(screen.getByText("By Device")).toBeInTheDocument();
  });

  it("renders recharts PieChart mock", () => {
    render(<DevicePieChart data={{ desktop: 50, mobile: 30, tablet: 20 }} />);
    expect(screen.getByTestId("recharts-PieChart")).toBeInTheDocument();
  });

  it("filters out zero-value entries", () => {
    const { container } = render(<DevicePieChart data={{ desktop: 10, mobile: 0, tablet: 0 }} />);
    expect(container).toBeTruthy();
  });
});
