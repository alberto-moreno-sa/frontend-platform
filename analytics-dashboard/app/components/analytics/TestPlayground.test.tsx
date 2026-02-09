import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { TestPlayground } from "./TestPlayground";

describe("TestPlayground", () => {
  it("renders the title", () => {
    render(<TestPlayground onTrack={jest.fn()} />);
    expect(screen.getByText("Test Playground")).toBeInTheDocument();
  });

  it("renders button section with interactive buttons", () => {
    render(<TestPlayground onTrack={jest.fn()} />);
    expect(screen.getByText("Click me")).toBeInTheDocument();
    expect(screen.getByText("Secondary")).toBeInTheDocument();
    expect(screen.getByText("Destructive")).toBeInTheDocument();
  });

  it("renders input section", () => {
    render(<TestPlayground onTrack={jest.fn()} />);
    expect(screen.getByPlaceholderText("Type here...")).toBeInTheDocument();
  });

  it("calls onTrack when button is clicked", async () => {
    const user = userEvent.setup();
    const onTrack = jest.fn();
    render(<TestPlayground onTrack={onTrack} />);

    await user.click(screen.getByText("Click me"));
    expect(onTrack).toHaveBeenCalledWith("Button", "primary", "click");
  });

  it("calls onTrack when input is focused", async () => {
    const user = userEvent.setup();
    const onTrack = jest.fn();
    render(<TestPlayground onTrack={onTrack} />);

    await user.click(screen.getByPlaceholderText("Type here..."));
    expect(onTrack).toHaveBeenCalledWith("Input", "default", "focus");
  });

  it("calls onTrack with blur when input loses focus", async () => {
    const user = userEvent.setup();
    const onTrack = jest.fn();
    render(<TestPlayground onTrack={onTrack} />);

    const input = screen.getByPlaceholderText("Type here...");
    await user.click(input);
    await user.tab();
    expect(onTrack).toHaveBeenCalledWith("Input", "default", "blur");
  });

  it("renders badge section with all intents", () => {
    render(<TestPlayground onTrack={jest.fn()} />);
    expect(screen.getAllByText("Sample")).toHaveLength(6);
  });

  it("renders modal trigger button", () => {
    render(<TestPlayground onTrack={jest.fn()} />);
    expect(screen.getByText("Open Modal")).toBeInTheDocument();
  });

  it("calls onTrack when modal trigger is clicked", async () => {
    const user = userEvent.setup();
    const onTrack = jest.fn();
    render(<TestPlayground onTrack={onTrack} />);

    await user.click(screen.getByText("Open Modal"));
    expect(onTrack).toHaveBeenCalledWith("Modal", "default", "click");
  });

  it("opens modal and renders modal content", async () => {
    const user = userEvent.setup();
    render(<TestPlayground onTrack={jest.fn()} />);

    await user.click(screen.getByText("Open Modal"));
    expect(screen.getByText("Sample Modal")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Confirm")).toBeInTheDocument();
  });

  it("calls onTrack with confirm when confirm button is clicked", async () => {
    const user = userEvent.setup();
    const onTrack = jest.fn();
    render(<TestPlayground onTrack={onTrack} />);

    await user.click(screen.getByText("Open Modal"));
    await user.click(screen.getByText("Confirm"));
    expect(onTrack).toHaveBeenCalledWith("Modal", "confirm", "click");
  });

  it("calls onTrack with cancel when cancel button is clicked", async () => {
    const user = userEvent.setup();
    const onTrack = jest.fn();
    render(<TestPlayground onTrack={onTrack} />);

    await user.click(screen.getByText("Open Modal"));
    await user.click(screen.getByText("Cancel"));
    expect(onTrack).toHaveBeenCalledWith("Modal", "cancel", "click");
  });
});
