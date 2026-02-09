import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Input } from "./Input";

/* ========== Input — basic ========== */

describe("Input", () => {
  it("renders an input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("renders with a label when provided", () => {
    render(<Input label="Email" />);
    expect(screen.getByLabelText("Email")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    render(<Input helperText="This field is required" />);
    expect(screen.getByText("This field is required")).toBeInTheDocument();
  });

  it("applies error variant", () => {
    render(<Input variant="error" helperText="Invalid email" />);
    const input = screen.getByRole("textbox");
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  it("applies size variants correctly", () => {
    const { rerender } = render(<Input size="small" />);
    expect(screen.getByRole("textbox").className).toContain("text-sm");

    rerender(<Input size="large" />);
    expect(screen.getByRole("textbox").className).toContain("text-lg");
  });

  it("handles user typing", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(<Input onChange={handleChange} />);
    await user.type(screen.getByRole("textbox"), "hello");
    expect(handleChange).toHaveBeenCalledTimes(5);
  });

  it("is disabled when disabled prop is set", () => {
    render(<Input disabled />);
    const input = screen.getByRole("textbox");
    expect(input).toBeDisabled();
    expect(input.className).toContain("cursor-not-allowed");
  });

  it("merges custom className", () => {
    render(<Input className="my-class" />);
    expect(screen.getByRole("textbox").className).toContain("my-class");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLInputElement>();
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });

  it("connects label to input via htmlFor/id", () => {
    render(<Input label="Username" id="username-input" />);
    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("id", "username-input");
  });
});

/* ========== Input — leading icon ========== */

describe("Input - leading icon", () => {
  const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="search-icon" {...props}>
      <circle cx="8" cy="8" r="6" />
    </svg>
  );

  it("renders a leading icon when icon prop is passed", () => {
    render(<Input icon={SearchIcon} />);
    expect(screen.getByTestId("search-icon")).toBeInTheDocument();
  });

  it("applies left padding when icon is present", () => {
    render(<Input icon={SearchIcon} size="medium" />);
    const input = screen.getByRole("textbox");
    expect(input.className).toContain("pl-11");
  });

  it("marks icon as aria-hidden", () => {
    render(<Input icon={SearchIcon} />);
    expect(screen.getByTestId("search-icon")).toHaveAttribute("aria-hidden", "true");
  });
});

/* ========== Input — error icon ========== */

describe("Input - error icon", () => {
  it("shows error icon when variant is error", () => {
    const { container } = render(<Input variant="error" />);
    const svgs = container.querySelectorAll("svg");
    expect(svgs.length).toBeGreaterThan(0);
  });

  it("sets aria-invalid when variant is error", () => {
    render(<Input variant="error" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("aria-invalid", "true");
  });
});

/* ========== Input — tooltip ========== */

describe("Input - tooltip", () => {
  it("renders tooltip icon with title attribute in label", () => {
    render(<Input label="Email" tooltip="This is a help message" />);
    expect(screen.getByTitle("This is a help message")).toBeInTheDocument();
  });

  it("shows tooltip icon even when variant is error", () => {
    render(<Input label="Email" tooltip="Help" variant="error" />);
    expect(screen.getByTitle("Help")).toBeInTheDocument();
  });
});

/* ========== Input — shortcut ========== */

describe("Input - shortcut", () => {
  it("renders default shortcut text when shortcut is true", () => {
    render(<Input shortcut />);
    expect(screen.getByText("⌘K")).toBeInTheDocument();
  });

  it("renders custom shortcut text", () => {
    render(<Input shortcut="⌘S" />);
    expect(screen.getByText("⌘S")).toBeInTheDocument();
  });

  it("shortcut is aria-hidden", () => {
    render(<Input shortcut />);
    expect(screen.getByText("⌘K")).toHaveAttribute("aria-hidden", "true");
  });
});

/* ========== Input — required ========== */

describe("Input - required", () => {
  it("shows asterisk when isRequired is true", () => {
    render(<Input label="Email" isRequired />);
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("hides asterisk when hideRequiredIndicator is true", () => {
    render(<Input label="Email" isRequired hideRequiredIndicator />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("does not show asterisk without isRequired", () => {
    render(<Input label="Email" />);
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("sets required attribute on input", () => {
    render(<Input isRequired />);
    expect(screen.getByRole("textbox")).toBeRequired();
  });
});
