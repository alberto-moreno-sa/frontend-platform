import { render, screen } from "@testing-library/react";
import { InteractionCounter } from "./InteractionCounter";

describe("InteractionCounter", () => {
  it("shows 'Live' when connected", () => {
    render(<InteractionCounter connected={true} liveCount={0} total={100} />);
    expect(screen.getByText("Live")).toBeInTheDocument();
  });

  it("shows 'Disconnected' when not connected", () => {
    render(<InteractionCounter connected={false} liveCount={0} total={100} />);
    expect(screen.getByText("Disconnected")).toBeInTheDocument();
  });

  it("shows green pulse indicator when connected", () => {
    const { container } = render(<InteractionCounter connected={true} liveCount={0} total={100} />);
    const dot = container.querySelector(".bg-green-500");
    expect(dot).toBeInTheDocument();
  });

  it("shows red indicator when disconnected", () => {
    const { container } = render(<InteractionCounter connected={false} liveCount={0} total={100} />);
    const dot = container.querySelector(".bg-red-500");
    expect(dot).toBeInTheDocument();
  });

  it("displays live count when greater than 0", () => {
    render(<InteractionCounter connected={true} liveCount={5} total={100} />);
    expect(screen.getByText(/\+5/)).toBeInTheDocument();
  });

  it("hides live count when 0", () => {
    render(<InteractionCounter connected={true} liveCount={0} total={100} />);
    expect(screen.queryByText(/\+0/)).not.toBeInTheDocument();
  });

  it("formats total with locale string", () => {
    render(<InteractionCounter connected={true} liveCount={0} total={1234} />);
    expect(screen.getByText(/1,234/)).toBeInTheDocument();
  });
});
