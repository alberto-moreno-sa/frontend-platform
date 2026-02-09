import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  Card,
  CardImage,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDivider,
} from "./Card";

/* ========== Card root ========== */

describe("Card", () => {
  it("renders with children", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).toBeInTheDocument();
    expect(screen.getByText("Content")).toBeInTheDocument();
  });

  it("applies default variant with shadow-xs", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card").className).toContain("shadow-xs");
    expect(screen.getByTestId("card").className).toContain("border-border-secondary");
  });

  it("applies elevated variant", () => {
    render(
      <Card variant="elevated" data-testid="card">
        Elevated
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("shadow-md");
  });

  it("applies outline variant", () => {
    render(
      <Card variant="outline" data-testid="card">
        Outline
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("shadow-none");
    expect(screen.getByTestId("card").className).toContain("border-border-primary");
  });

  it("applies ghost variant", () => {
    render(
      <Card variant="ghost" data-testid="card">
        Ghost
      </Card>,
    );
    expect(screen.getByTestId("card").className).toContain("shadow-none");
    expect(screen.getByTestId("card").className).toContain("border-transparent");
  });

  it("applies interactive styles and tabIndex", () => {
    render(
      <Card interactive data-testid="card">
        Clickable
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("cursor-pointer");
    expect(card).toHaveAttribute("tabindex", "0");
  });

  it("does not set tabIndex when not interactive", () => {
    render(<Card data-testid="card">Content</Card>);
    expect(screen.getByTestId("card")).not.toHaveAttribute("tabindex");
  });

  it("merges custom className", () => {
    render(
      <Card className="custom-class" data-testid="card">
        Content
      </Card>,
    );
    const card = screen.getByTestId("card");
    expect(card.className).toContain("custom-class");
    expect(card.className).toContain("rounded-xl");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<Card ref={ref}>Content</Card>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ========== CardImage ========== */

describe("CardImage", () => {
  it("renders an img element", () => {
    render(<CardImage src="test.jpg" alt="Test image" data-testid="img" />);
    const img = screen.getByTestId("img");
    expect(img.tagName).toBe("IMG");
    expect(img).toHaveAttribute("src", "test.jpg");
    expect(img).toHaveAttribute("alt", "Test image");
  });

  it("defaults to empty alt text", () => {
    render(<CardImage src="test.jpg" data-testid="img" />);
    expect(screen.getByTestId("img")).toHaveAttribute("alt", "");
  });

  it("applies height variants", () => {
    const { rerender } = render(<CardImage src="t.jpg" height="sm" data-testid="img" />);
    expect(screen.getByTestId("img").className).toContain("h-32");

    rerender(<CardImage src="t.jpg" height="lg" data-testid="img" />);
    expect(screen.getByTestId("img").className).toContain("h-64");
  });

  it("applies object-cover", () => {
    render(<CardImage src="t.jpg" data-testid="img" />);
    expect(screen.getByTestId("img").className).toContain("object-cover");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLImageElement>();
    render(<CardImage ref={ref} src="t.jpg" />);
    expect(ref.current).toBeInstanceOf(HTMLImageElement);
  });
});

/* ========== CardHeader ========== */

describe("CardHeader", () => {
  it("renders children", () => {
    render(<CardHeader>Header content</CardHeader>);
    expect(screen.getByText("Header content")).toBeInTheDocument();
  });

  it("renders action in top-right", () => {
    render(
      <CardHeader action={<button data-testid="action-btn">Edit</button>}>
        <CardTitle>Title</CardTitle>
      </CardHeader>,
    );
    expect(screen.getByTestId("action-btn")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
  });

  it("applies hasAction layout when action is provided", () => {
    const { container } = render(
      <CardHeader action={<button>Edit</button>}>Title</CardHeader>,
    );
    const header = container.firstChild as HTMLElement;
    expect(header.className).toContain("flex-row");
    expect(header.className).toContain("justify-between");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardHeader ref={ref}>Header</CardHeader>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ========== CardTitle ========== */

describe("CardTitle", () => {
  it("renders as h3", () => {
    render(<CardTitle>Heading</CardTitle>);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent("Heading");
  });

  it("applies text-lg by default", () => {
    render(<CardTitle>Title</CardTitle>);
    expect(screen.getByRole("heading").className).toContain("text-lg");
  });
});

/* ========== CardDescription ========== */

describe("CardDescription", () => {
  it("renders text", () => {
    render(<CardDescription>Description text</CardDescription>);
    expect(screen.getByText("Description text")).toBeInTheDocument();
  });

  it("applies text-text-tertiary", () => {
    const { container } = render(<CardDescription>Desc</CardDescription>);
    expect((container.firstChild as HTMLElement).className).toContain("text-text-tertiary");
  });
});

/* ========== CardContent ========== */

describe("CardContent", () => {
  it("renders children", () => {
    render(<CardContent>Body content</CardContent>);
    expect(screen.getByText("Body content")).toBeInTheDocument();
  });

  it("applies default padding", () => {
    const { container } = render(<CardContent>Body</CardContent>);
    expect((container.firstChild as HTMLElement).className).toContain("px-6");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<CardContent ref={ref}>Body</CardContent>);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ========== CardFooter ========== */

describe("CardFooter", () => {
  it("renders children", () => {
    render(<CardFooter>Footer content</CardFooter>);
    expect(screen.getByText("Footer content")).toBeInTheDocument();
  });

  it("applies flex layout", () => {
    const { container } = render(<CardFooter>Footer</CardFooter>);
    const footer = container.firstChild as HTMLElement;
    expect(footer.className).toContain("flex");
    expect(footer.className).toContain("items-center");
  });
});

/* ========== CardDivider ========== */

describe("CardDivider", () => {
  it("renders an hr element", () => {
    render(<CardDivider data-testid="divider" />);
    const divider = screen.getByTestId("divider");
    expect(divider.tagName).toBe("HR");
    expect(divider.className).toContain("border-t");
    expect(divider.className).toContain("border-border-secondary");
  });

  it("forwards ref", () => {
    const ref = React.createRef<HTMLHRElement>();
    render(<CardDivider ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLHRElement);
  });
});

/* ========== Size propagation via context ========== */

describe("Card size context", () => {
  it("propagates sm size to sub-components", () => {
    render(
      <Card size="sm">
        <CardHeader>
          <CardTitle>Title</CardTitle>
          <CardDescription>Desc</CardDescription>
        </CardHeader>
        <CardContent>Body</CardContent>
        <CardFooter>Footer</CardFooter>
      </Card>,
    );
    const title = screen.getByRole("heading");
    expect(title.className).toContain("text-md");
  });
});

/* ========== Full composition ========== */

describe("Card - full composition", () => {
  it("renders all sub-components together", () => {
    render(
      <Card>
        <CardImage src="test.jpg" alt="Cover" />
        <CardHeader action={<button>Action</button>}>
          <CardTitle>Title</CardTitle>
          <CardDescription>Description</CardDescription>
        </CardHeader>
        <CardDivider />
        <CardContent>Main content</CardContent>
        <CardDivider />
        <CardFooter>Footer content</CardFooter>
      </Card>,
    );
    expect(screen.getByAltText("Cover")).toBeInTheDocument();
    expect(screen.getByText("Title")).toBeInTheDocument();
    expect(screen.getByText("Description")).toBeInTheDocument();
    expect(screen.getByText("Main content")).toBeInTheDocument();
    expect(screen.getByText("Footer content")).toBeInTheDocument();
    expect(screen.getByText("Action")).toBeInTheDocument();
  });

  it("renders with only header (optional body/footer)", () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Header Only</CardTitle>
        </CardHeader>
      </Card>,
    );
    expect(screen.getByText("Header Only")).toBeInTheDocument();
  });

  it("renders with only content (optional header/footer)", () => {
    render(
      <Card>
        <CardContent>Content Only</CardContent>
      </Card>,
    );
    expect(screen.getByText("Content Only")).toBeInTheDocument();
  });

  it("interactive card responds to click", async () => {
    const user = userEvent.setup();
    const handleClick = jest.fn();
    render(
      <Card interactive onClick={handleClick} data-testid="card">
        <CardContent>Click me</CardContent>
      </Card>,
    );
    await user.click(screen.getByTestId("card"));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
});
