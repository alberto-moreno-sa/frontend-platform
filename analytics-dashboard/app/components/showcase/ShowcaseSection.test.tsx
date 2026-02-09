import { render, screen } from "@testing-library/react";
import { ShowcaseSection } from "./ShowcaseSection";

describe("ShowcaseSection", () => {
  it("renders the title", () => {
    render(<ShowcaseSection title="Buttons">content</ShowcaseSection>);
    expect(screen.getByText("Buttons")).toBeInTheDocument();
  });

  it("renders the description when provided", () => {
    render(<ShowcaseSection title="Buttons" description="All button variants">content</ShowcaseSection>);
    expect(screen.getByText("All button variants")).toBeInTheDocument();
  });

  it("does not render description when not provided", () => {
    render(<ShowcaseSection title="Buttons">content</ShowcaseSection>);
    const heading = screen.getByText("Buttons");
    expect(heading.parentElement?.querySelector("p")).toBeNull();
  });

  it("renders children", () => {
    render(<ShowcaseSection title="Test"><button>Click me</button></ShowcaseSection>);
    expect(screen.getByRole("button", { name: "Click me" })).toBeInTheDocument();
  });
});
