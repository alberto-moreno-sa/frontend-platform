import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { DatePickerRange } from "./DatePickerRange";

beforeAll(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 1, 9)); // Feb 9, 2026
});

afterAll(() => {
  jest.useRealTimers();
});

/* ========== Rendering ========== */

describe("DatePickerRange — Rendering", () => {
  it("renders trigger with placeholder when no value", () => {
    render(<DatePickerRange />);
    expect(screen.getByText("Select date range")).toBeInTheDocument();
  });

  it("renders trigger with formatted range when value is provided", () => {
    const value = { from: new Date(2026, 1, 2), to: new Date(2026, 1, 14) };
    render(<DatePickerRange value={value} />);
    expect(screen.getByText("Feb 2, 2026 – Feb 14, 2026")).toBeInTheDocument();
  });

  it("renders trigger with custom placeholder", () => {
    render(<DatePickerRange placeholder="Pick a range" />);
    expect(screen.getByText("Pick a range")).toBeInTheDocument();
  });

  it("renders trigger with custom display format", () => {
    const value = { from: new Date(2026, 1, 2), to: new Date(2026, 1, 14) };
    render(<DatePickerRange value={value} displayFormat="dd/MM/yyyy" />);
    expect(screen.getByText("02/02/2026 – 14/02/2026")).toBeInTheDocument();
  });

  it("renders the calendar icon in the trigger", () => {
    render(<DatePickerRange />);
    const svg = screen.getByRole("button").querySelector("svg");
    expect(svg).toBeInTheDocument();
  });

  it("does not render popover when closed", () => {
    render(<DatePickerRange />);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("applies custom className to trigger", () => {
    render(<DatePickerRange className="my-custom-class" />);
    expect(screen.getByRole("button")).toHaveClass("my-custom-class");
  });

  it("has aria-haspopup attribute on trigger", () => {
    render(<DatePickerRange />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-haspopup", "dialog");
  });

  it("has aria-expanded false when closed", () => {
    render(<DatePickerRange />);
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });
});

/* ========== Opening/Closing ========== */

describe("DatePickerRange — Opening/Closing", () => {
  it("opens popover on trigger click", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();
  });

  it("has aria-expanded true when open", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);
    const trigger = screen.getByText("Select date range").closest("button")!;

    await user.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");
  });

  it("renders Cancel and Apply buttons when open", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Apply")).toBeInTheDocument();
  });

  it("renders date inputs when open", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByLabelText("Start date")).toBeInTheDocument();
    expect(screen.getByLabelText("End date")).toBeInTheDocument();
  });

  it("closes popover on Cancel click", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByText("Cancel"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes popover on Apply click", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Apply"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes popover on outside click (overlay)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.click(screen.getByTestId("datepicker-overlay"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("closes popover on Escape key", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByRole("dialog")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("calls onOpenChange when popover opens", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onOpenChange = jest.fn();
    render(<DatePickerRange onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange when popover closes", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onOpenChange = jest.fn();
    render(<DatePickerRange onOpenChange={onOpenChange} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Cancel"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

/* ========== Date Selection ========== */

describe("DatePickerRange — Selection", () => {
  it("Cancel discards the draft (onChange not called)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onChange = jest.fn();
    render(<DatePickerRange onChange={onChange} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Cancel"));
    expect(onChange).not.toHaveBeenCalled();
  });

  it("Apply commits the draft (onChange called)", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const onChange = jest.fn();
    render(<DatePickerRange onChange={onChange} />);

    await user.click(screen.getByRole("button"));
    await user.click(screen.getByText("Apply"));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it("shows two month calendars by default", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    // February and March 2026
    expect(screen.getByText("February 2026")).toBeInTheDocument();
    expect(screen.getByText("March 2026")).toBeInTheDocument();
  });

  it("shows only one month when numberOfMonths=1", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange numberOfMonths={1} />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("February 2026")).toBeInTheDocument();
    expect(screen.queryByText("March 2026")).not.toBeInTheDocument();
  });

  it("populates date inputs with existing value on open", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    const value = { from: new Date(2026, 1, 2), to: new Date(2026, 1, 14) };
    render(<DatePickerRange value={value} />);

    await user.click(screen.getByRole("button"));
    const startInput = screen.getByLabelText("Start date") as HTMLInputElement;
    const endInput = screen.getByLabelText("End date") as HTMLInputElement;
    expect(startInput.value).toBe("2 / 2 / 2026");
    expect(endInput.value).toBe("2 / 14 / 2026");
  });
});

/* ========== Disabled ========== */

describe("DatePickerRange — Disabled", () => {
  it("does not open popover when disabled", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange disabled />);

    await user.click(screen.getByRole("button"));
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("trigger has disabled attribute when disabled", () => {
    render(<DatePickerRange disabled />);
    expect(screen.getByRole("button")).toBeDisabled();
  });
});

/* ========== Ref forwarding ========== */

describe("DatePickerRange — Ref", () => {
  it("forwards ref to the wrapper div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(<DatePickerRange ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });
});

/* ========== Custom labels ========== */

describe("DatePickerRange — Custom labels", () => {
  it("renders custom cancel label", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange cancelLabel="Cancelar" applyLabel="Aplicar" />);

    await user.click(screen.getByRole("button"));
    expect(screen.getByText("Cancelar")).toBeInTheDocument();
    expect(screen.getByText("Aplicar")).toBeInTheDocument();
  });
});

/* ========== Today indicator ========== */

describe("DatePickerRange — Today", () => {
  it("renders today dot indicator for current date", async () => {
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    render(<DatePickerRange />);

    await user.click(screen.getByRole("button"));
    const todayDots = screen.getAllByTestId("today-dot");
    expect(todayDots.length).toBeGreaterThanOrEqual(1);
  });
});
