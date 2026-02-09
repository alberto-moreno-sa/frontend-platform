import React from "react";
import { render, screen } from "@testing-library/react";
import { Input } from "../input/Input";
import { InputGroup, InputPrefix } from "./InputGroup";

/* ========== InputGroup ========== */

describe("InputGroup", () => {
  it("renders children", () => {
    render(
      <InputGroup>
        <Input placeholder="Search" />
      </InputGroup>,
    );
    expect(screen.getByPlaceholderText("Search")).toBeInTheDocument();
  });

  it("renders label and hint", () => {
    render(
      <InputGroup label="Website" hint="Enter your website URL">
        <Input />
      </InputGroup>,
    );
    expect(screen.getByText("Website")).toBeInTheDocument();
    expect(screen.getByText("Enter your website URL")).toBeInTheDocument();
  });

  it("renders leadingAddon and trailingAddon", () => {
    render(
      <InputGroup
        leadingAddon={<span data-testid="leading">$</span>}
        trailingAddon={<button data-testid="trailing">Go</button>}
      >
        <Input />
      </InputGroup>,
    );
    expect(screen.getByTestId("leading")).toBeInTheDocument();
    expect(screen.getByTestId("trailing")).toBeInTheDocument();
  });

  it("renders prefix text", () => {
    render(
      <InputGroup prefix="https://">
        <Input />
      </InputGroup>,
    );
    expect(screen.getByText("https://")).toBeInTheDocument();
  });

  it("applies error style to hint when isInvalid", () => {
    render(
      <InputGroup hint="Required field" isInvalid>
        <Input />
      </InputGroup>,
    );
    expect(screen.getByText("Required field").className).toContain("error");
  });

  it("shows required indicator on label", () => {
    render(
      <InputGroup label="URL" isRequired>
        <Input />
      </InputGroup>,
    );
    expect(screen.getByText("*")).toBeInTheDocument();
  });
});

/* ========== InputPrefix ========== */

describe("InputPrefix", () => {
  it("renders children", () => {
    render(<InputPrefix>https://</InputPrefix>);
    expect(screen.getByText("https://")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(<InputPrefix ref={ref}>$</InputPrefix>);
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
  });
});
