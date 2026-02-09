import React from "react";
import { render, screen } from "@testing-library/react";
import { Textarea } from "./Textarea";

/* ========== Textarea ========== */

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Enter description" />);
    expect(screen.getByPlaceholderText("Enter description")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter description").tagName).toBe("TEXTAREA");
  });

  it("renders with label, tooltip, and helper text", () => {
    render(
      <Textarea label="Description" tooltip="Help text" helperText="This is a hint" isRequired />,
    );
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("*")).toBeInTheDocument();
    expect(screen.getByTitle("Help text")).toBeInTheDocument();
    expect(screen.getByText("This is a hint")).toBeInTheDocument();
  });

  it("applies error variant", () => {
    render(<Textarea variant="error" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });

  it("is disabled when disabled prop is set", () => {
    render(<Textarea disabled />);
    expect(screen.getByRole("textbox")).toBeDisabled();
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("defaults to 4 rows", () => {
    render(<Textarea />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "4");
  });

  it("accepts custom rows", () => {
    render(<Textarea rows={8} />);
    expect(screen.getByRole("textbox")).toHaveAttribute("rows", "8");
  });
});
