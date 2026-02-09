import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Modal,
  ModalHeader,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalDivider,
} from "./Modal";

/* ========== Modal — open/close ========== */

describe("Modal", () => {
  const defaultProps = {
    open: true,
    onOpenChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders when open is true", () => {
    render(
      <Modal {...defaultProps}>
        <ModalBody>Modal content</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when open is false", () => {
    render(
      <Modal {...defaultProps} open={false}>
        <ModalBody>Hidden content</ModalBody>
      </Modal>,
    );
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("has aria-modal attribute", () => {
    render(
      <Modal {...defaultProps}>
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole("dialog")).toHaveAttribute("aria-modal", "true");
  });

  it("sets body overflow hidden when open", () => {
    render(
      <Modal {...defaultProps}>
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    expect(document.body.style.overflow).toBe("hidden");
  });

  it("restores body overflow when closed", () => {
    const { unmount } = render(
      <Modal {...defaultProps}>
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    unmount();
    expect(document.body.style.overflow).toBe("");
  });

  it("merges custom className on dialog", () => {
    render(
      <Modal {...defaultProps} className="custom-modal">
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole("dialog").className).toContain("custom-modal");
    expect(screen.getByRole("dialog").className).toContain("rounded-xl");
  });
});

/* ========== Modal — close mechanisms ========== */

describe("Modal - close mechanisms", () => {
  it("calls onOpenChange when overlay is clicked", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <Modal open onOpenChange={handleChange}>
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    await user.click(screen.getByTestId("modal-overlay"));
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it("does not close on overlay click when closeOnOverlayClick is false", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <Modal open onOpenChange={handleChange} closeOnOverlayClick={false}>
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    await user.click(screen.getByTestId("modal-overlay"));
    expect(handleChange).not.toHaveBeenCalled();
  });

  it("calls onOpenChange when Escape key is pressed", async () => {
    const user = userEvent.setup();
    const handleChange = jest.fn();
    render(
      <Modal open onOpenChange={handleChange}>
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    await user.keyboard("{Escape}");
    expect(handleChange).toHaveBeenCalledWith(false);
  });

  it("renders close button when onClose is provided in ModalHeader", async () => {
    const user = userEvent.setup();
    const handleClose = jest.fn();
    render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalHeader onClose={handleClose}>
          <ModalTitle>Title</ModalTitle>
        </ModalHeader>
      </Modal>,
    );
    const closeButton = screen.getByLabelText("Close");
    expect(closeButton).toBeInTheDocument();
    await user.click(closeButton);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("does not render close button when onClose is not provided", () => {
    render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalHeader>
          <ModalTitle>Title</ModalTitle>
        </ModalHeader>
      </Modal>,
    );
    expect(screen.queryByLabelText("Close")).not.toBeInTheDocument();
  });
});

/* ========== Modal — sizes ========== */

describe("Modal - sizes", () => {
  it("applies sm size", () => {
    render(
      <Modal open onOpenChange={jest.fn()} size="sm">
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole("dialog").className).toContain("max-w-sm");
  });

  it("applies md size by default", () => {
    render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole("dialog").className).toContain("max-w-lg");
  });

  it("applies lg size", () => {
    render(
      <Modal open onOpenChange={jest.fn()} size="lg">
        <ModalBody>Content</ModalBody>
      </Modal>,
    );
    expect(screen.getByRole("dialog").className).toContain("max-w-2xl");
  });
});

/* ========== ModalHeader — icon slot ========== */

describe("ModalHeader - icon slot", () => {
  it("renders featured icon when provided", () => {
    render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalHeader icon={<div data-testid="feat-icon">Icon</div>}>
          <ModalTitle>Title</ModalTitle>
        </ModalHeader>
      </Modal>,
    );
    expect(screen.getByTestId("feat-icon")).toBeInTheDocument();
  });

  it("does not render icon wrapper when icon is not provided", () => {
    const { container } = render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalHeader>
          <ModalTitle>Title</ModalTitle>
        </ModalHeader>
      </Modal>,
    );
    expect(container.querySelector(".shrink-0")).not.toBeInTheDocument();
  });
});

/* ========== ModalIcon ========== */

describe("ModalIcon", () => {
  it("renders children", () => {
    render(
      <ModalIcon data-testid="icon">
        <span>IC</span>
      </ModalIcon>,
    );
    expect(screen.getByText("IC")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(
      <ModalIcon variant="success" data-testid="icon">
        <span>OK</span>
      </ModalIcon>,
    );
    const icon = screen.getByTestId("icon");
    expect(icon.className).toContain("bg-success-50");
    expect(icon.className).toContain("text-success-600");
  });

  it("applies error variant", () => {
    render(
      <ModalIcon variant="error" data-testid="icon">
        <span>!</span>
      </ModalIcon>,
    );
    expect(screen.getByTestId("icon").className).toContain("bg-error-50");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <ModalIcon ref={ref}>
        <span>I</span>
      </ModalIcon>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ========== ModalTitle ========== */

describe("ModalTitle", () => {
  it("renders as h2", () => {
    render(<ModalTitle>Modal Heading</ModalTitle>);
    expect(screen.getByRole("heading", { level: 2 })).toHaveTextContent("Modal Heading");
  });

  it("applies text styles", () => {
    render(<ModalTitle>Title</ModalTitle>);
    expect(screen.getByRole("heading").className).toContain("text-lg");
    expect(screen.getByRole("heading").className).toContain("font-semibold");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLHeadingElement>();
    render(<ModalTitle ref={ref}>Title</ModalTitle>);
    expect(ref.current).toBeInstanceOf(HTMLHeadingElement);
  });
});

/* ========== ModalDescription ========== */

describe("ModalDescription", () => {
  it("renders text", () => {
    render(<ModalDescription>Description text here</ModalDescription>);
    expect(screen.getByText("Description text here")).toBeInTheDocument();
  });

  it("applies text-text-tertiary style", () => {
    const { container } = render(<ModalDescription>Desc</ModalDescription>);
    expect((container.firstChild as HTMLElement).className).toContain("text-text-tertiary");
  });
});

/* ========== ModalBody ========== */

describe("ModalBody", () => {
  it("renders children", () => {
    render(<ModalBody>Body content here</ModalBody>);
    expect(screen.getByText("Body content here")).toBeInTheDocument();
  });

  it("applies overflow-y-auto for scrolling", () => {
    const { container } = render(<ModalBody>Body</ModalBody>);
    expect((container.firstChild as HTMLElement).className).toContain("overflow-y-auto");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<ModalBody ref={ref}>Body</ModalBody>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ========== ModalFooter ========== */

describe("ModalFooter", () => {
  it("renders children", () => {
    render(<ModalFooter>Footer actions</ModalFooter>);
    expect(screen.getByText("Footer actions")).toBeInTheDocument();
  });

  it("applies flex layout", () => {
    const { container } = render(<ModalFooter>Footer</ModalFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer.className).toContain("flex");
    expect(footer.className).toContain("items-center");
  });
});

/* ========== ModalDivider ========== */

describe("ModalDivider", () => {
  it("renders an hr element", () => {
    render(<ModalDivider data-testid="divider" />);
    expect(screen.getByTestId("divider").tagName).toBe("HR");
    expect(screen.getByTestId("divider").className).toContain("border-border-secondary");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLHRElement>();
    render(<ModalDivider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });
});

/* ========== Full composition ========== */

describe("Modal - full composition", () => {
  it("renders all sub-components together", () => {
    render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalHeader
          onClose={jest.fn()}
          icon={
            <ModalIcon variant="brand">
              <span data-testid="brand-icon">B</span>
            </ModalIcon>
          }
        >
          <ModalTitle>Full Modal</ModalTitle>
          <ModalDescription>With all sub-components</ModalDescription>
        </ModalHeader>
        <ModalDivider />
        <ModalBody>Body content</ModalBody>
        <ModalDivider />
        <ModalFooter>
          <button>Cancel</button>
          <button>Confirm</button>
        </ModalFooter>
      </Modal>,
    );
    expect(screen.getByTestId("brand-icon")).toBeInTheDocument();
    expect(screen.getByText("Full Modal")).toBeInTheDocument();
    expect(screen.getByText("With all sub-components")).toBeInTheDocument();
    expect(screen.getByText("Body content")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
    expect(screen.getByLabelText("Close")).toBeInTheDocument();
  });

  it("renders without body (header + footer only)", () => {
    render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalHeader onClose={jest.fn()}>
          <ModalTitle>Quick confirm</ModalTitle>
        </ModalHeader>
        <ModalFooter>
          <button>OK</button>
        </ModalFooter>
      </Modal>,
    );
    expect(screen.getByText("Quick confirm")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });

  it("renders without footer (header + body only)", () => {
    render(
      <Modal open onOpenChange={jest.fn()}>
        <ModalHeader onClose={jest.fn()}>
          <ModalTitle>Info</ModalTitle>
        </ModalHeader>
        <ModalBody>Just some info</ModalBody>
      </Modal>,
    );
    expect(screen.getByText("Info")).toBeInTheDocument();
    expect(screen.getByText("Just some info")).toBeInTheDocument();
  });
});
