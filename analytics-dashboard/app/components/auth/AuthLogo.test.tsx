import { render } from "@testing-library/react";
import { AuthLogo } from "./AuthLogo";

describe("AuthLogo", () => {
  it("renders the SVG icon", () => {
    const { container } = render(<AuthLogo />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("renders the brand circle container", () => {
    const { container } = render(<AuthLogo />);
    const circle = container.querySelector(".rounded-full");
    expect(circle).toBeInTheDocument();
  });

  it("renders three bar chart rectangles", () => {
    const { container } = render(<AuthLogo />);
    const rects = container.querySelectorAll("rect");
    expect(rects).toHaveLength(3);
  });
});
