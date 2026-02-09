import { render, screen } from "@testing-library/react";
import { ActivityFeed } from "./ActivityFeed";
import type { LiveInteractionEvent } from "~/lib/tracking-types";

const mockEvents: LiveInteractionEvent[] = [
  { componentName: "Button", variant: "primary", action: "click", pageUrl: "/", timestamp: new Date().toISOString() },
  { componentName: "Input", variant: "default", action: "focus", pageUrl: "/form", timestamp: new Date().toISOString() },
];

describe("ActivityFeed", () => {
  it("renders events", () => {
    render(<ActivityFeed events={mockEvents} />);
    expect(screen.getByText("Button")).toBeInTheDocument();
    expect(screen.getByText(".primary")).toBeInTheDocument();
    expect(screen.getByText("click")).toBeInTheDocument();
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("focus")).toBeInTheDocument();
  });

  it("renders empty state when no events", () => {
    render(<ActivityFeed events={[]} />);
    expect(screen.getByText("Waiting for interactions...")).toBeInTheDocument();
  });

  it("shows just now timestamp for each event", () => {
    render(<ActivityFeed events={mockEvents} />);
    expect(screen.getAllByText("just now")).toHaveLength(2);
  });
});
