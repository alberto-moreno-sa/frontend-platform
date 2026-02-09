import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button, CloseButton } from "./Button";

/* ========== Helper icons ========== */

const LeadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="lead-icon" {...props}>
    <circle cx="10" cy="10" r="8" />
  </svg>
);

const TrailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg data-testid="trail-icon" {...props}>
    <circle cx="10" cy="10" r="8" />
  </svg>
);

/* ========== Button — basic rendering ========== */

describe("Button", () => {
  it("renders with children text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole("button", { name: /click me/i })).toBeInTheDocument();
  });

  it("applies primary variant classes by default", () => {
    render(<Button>Primary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-brand-600");
    expect(button.className).toContain("text-white");
  });

  it("applies secondaryGray variant classes", () => {
    render(<Button variant="secondaryGray">Secondary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("border-border-primary");
    expect(button.className).toContain("text-fg-secondary");
  });

  it("applies tertiaryGray variant classes", () => {
    render(<Button variant="tertiaryGray">Tertiary</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-transparent");
    expect(button.className).toContain("text-fg-tertiary");
  });

  it("applies linkColor variant classes", () => {
    render(<Button variant="linkColor">Link</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("text-brand-700");
    expect(button.className).toContain("border-transparent");
  });

  it("applies size variants correctly", () => {
    const { rerender } = render(<Button size="sm">Small</Button>);
    expect(screen.getByRole("button").className).toContain("h-9");

    rerender(<Button size="lg">Large</Button>);
    expect(screen.getByRole("button").className).toContain("h-11");

    rerender(<Button size="2xl">2XL</Button>);
    expect(screen.getByRole("button").className).toContain("h-[60px]");
  });

  it("calls onClick handler when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click</Button>);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when disabled", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button disabled onClick={handleClick}>
        Disabled
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    await user.click(button);
    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies disabled styling", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("cursor-not-allowed");
    expect(button.className).toContain("pointer-events-none");
  });

  it("merges custom className with variant classes", () => {
    render(<Button className="my-custom-class">Styled</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("my-custom-class");
    expect(button.className).toContain("bg-brand-600");
  });

  it("forwards ref to button element", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes additional HTML attributes", () => {
    render(
      <Button data-testid="custom-btn" type="submit">
        Submit
      </Button>,
    );
    const button = screen.getByTestId("custom-btn");
    expect(button).toHaveAttribute("type", "submit");
  });
});

/* ========== Button — destructive ========== */

describe("Button - destructive", () => {
  it("applies destructive primary classes", () => {
    render(<Button destructive>Delete</Button>);
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-error-600");
    expect(button.className).toContain("border-error-600");
  });

  it("applies destructive secondaryColor classes", () => {
    render(
      <Button variant="secondaryColor" destructive>
        Delete
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("text-error-700");
    expect(button.className).toContain("border-error-300");
  });

  it("applies disabled classes over destructive when both set", () => {
    render(
      <Button destructive disabled>
        Delete
      </Button>,
    );
    const button = screen.getByRole("button");
    expect(button.className).toContain("bg-bg-disabled");
    expect(button.className).toContain("text-fg-disabled");
    expect(button).toBeDisabled();
  });
});

/* ========== Button — leading / trailing icons ========== */

describe("Button - icons", () => {
  it("renders a leading icon", () => {
    render(<Button leadingIcon={LeadIcon}>With Icon</Button>);
    expect(screen.getByTestId("lead-icon")).toBeInTheDocument();
  });

  it("renders a trailing icon", () => {
    render(<Button trailingIcon={TrailIcon}>With Icon</Button>);
    expect(screen.getByTestId("trail-icon")).toBeInTheDocument();
  });

  it("renders both leading and trailing icons", () => {
    render(
      <Button leadingIcon={LeadIcon} trailingIcon={TrailIcon}>
        Both
      </Button>,
    );
    expect(screen.getByTestId("lead-icon")).toBeInTheDocument();
    expect(screen.getByTestId("trail-icon")).toBeInTheDocument();
  });

  it("marks icons as aria-hidden", () => {
    render(<Button leadingIcon={LeadIcon}>Icon</Button>);
    expect(screen.getByTestId("lead-icon")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies icon-only sizing when only icon, no children", () => {
    render(<Button leadingIcon={LeadIcon} aria-label="Add" />);
    const button = screen.getByRole("button");
    expect(button.className).toContain("w-10");
    expect(button.className).toContain("h-10");
  });
});

/* ========== Button — loading ========== */

describe("Button - loading", () => {
  it("shows spinner when loading", () => {
    const { container } = render(<Button loading>Save</Button>);
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("shows loadingText when provided", () => {
    render(
      <Button loading loadingText="Submitting...">
        Save
      </Button>,
    );
    expect(screen.getByText("Submitting...")).toBeInTheDocument();
  });

  it("falls back to children text when no loadingText", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  it("hides icons while loading", () => {
    render(
      <Button loading leadingIcon={LeadIcon} trailingIcon={TrailIcon}>
        Save
      </Button>,
    );
    expect(screen.queryByTestId("lead-icon")).not.toBeInTheDocument();
    expect(screen.queryByTestId("trail-icon")).not.toBeInTheDocument();
  });

  it("disables button while loading", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("sets aria-busy when loading", () => {
    render(<Button loading>Save</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("aria-busy", "true");
  });

  it("does not call onClick while loading", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Button loading onClick={handleClick}>
        Save
      </Button>,
    );
    await user.click(screen.getByRole("button"));
    expect(handleClick).not.toHaveBeenCalled();
  });
});

/* ========== CloseButton ========== */

describe("CloseButton", () => {
  it("renders with default aria-label", () => {
    render(<CloseButton />);
    expect(screen.getByRole("button", { name: /close/i })).toBeInTheDocument();
  });

  it("renders close icon (X)", () => {
    const { container } = render(<CloseButton />);
    const svg = container.querySelector("svg");
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute("aria-hidden", "true");
  });

  it("accepts custom aria-label", () => {
    render(<CloseButton aria-label="Dismiss" />);
    expect(screen.getByRole("button", { name: /dismiss/i })).toBeInTheDocument();
  });

  it("applies size variants", () => {
    const { rerender } = render(<CloseButton size="sm" />);
    expect(screen.getByRole("button").className).toContain("size-9");

    rerender(<CloseButton size="lg" />);
    expect(screen.getByRole("button").className).toContain("size-11");
  });

  it("is disabled when disabled prop is set", () => {
    render(<CloseButton disabled />);
    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
    expect(button.className).toContain("cursor-not-allowed");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<CloseButton ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(<CloseButton onClick={handleClick} />);
    await user.click(screen.getByRole("button"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
