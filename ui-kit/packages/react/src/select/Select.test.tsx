import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Select, SelectItem, SelectGroup, SelectSeparator } from "./Select";

const renderSelect = (props: Partial<React.ComponentProps<typeof Select>> = {}) =>
  render(
    <Select placeholder="Select option" {...props}>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="banana">Banana</SelectItem>
      <SelectItem value="cherry">Cherry</SelectItem>
    </Select>,
  );

/* ========== Rendering ========== */

describe("Select — Rendering", () => {
  it("renders a trigger button with placeholder text", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Select option")).toBeInTheDocument();
  });

  it("renders with a label when provided", () => {
    renderSelect({ label: "Fruit" });
    expect(screen.getByText("Fruit")).toBeInTheDocument();
  });

  it("renders helper text when provided", () => {
    renderSelect({ helperText: "Pick a fruit" });
    expect(screen.getByText("Pick a fruit")).toBeInTheDocument();
  });

  it("applies error variant class on trigger", () => {
    renderSelect({ variant: "error" });
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("border-border-error_subtle");
  });

  it("applies small size class on trigger", () => {
    renderSelect({ size: "small" });
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("text-sm");
  });

  it("applies large size class on trigger", () => {
    renderSelect({ size: "large" });
    const trigger = screen.getByRole("combobox");
    expect(trigger.className).toContain("text-lg");
  });

  it("is disabled when disabled prop is set", () => {
    renderSelect({ disabled: true });
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("merges custom className onto trigger", () => {
    renderSelect({ className: "my-custom-class" });
    expect(screen.getByRole("combobox")).toHaveClass("my-custom-class");
  });

  it("forwards ref to wrapper div", () => {
    const ref = React.createRef<HTMLDivElement>();
    render(
      <Select ref={ref} placeholder="Select">
        <SelectItem value="a">A</SelectItem>
      </Select>,
    );
    expect(ref.current).toBeInstanceOf(HTMLDivElement);
  });

  it("connects label to trigger via htmlFor", () => {
    renderSelect({ label: "Fruit", id: "fruit-select" });
    const label = screen.getByText("Fruit").closest("label");
    expect(label).toHaveAttribute("for", "fruit-select");
  });
});

/* ========== Open/Close ========== */

describe("Select — Open/Close", () => {
  it("opens dropdown on trigger click", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("closes dropdown on second trigger click", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByRole("combobox"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown when clicking the overlay", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.click(screen.getByTestId("select-overlay"));
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown on Escape key", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("closes dropdown on Tab key", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("listbox")).toBeInTheDocument();

    await user.keyboard("{Tab}");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("trigger has aria-expanded=true when open", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "true");
  });

  it("trigger has aria-expanded=false when closed", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-expanded", "false");
  });

  it("trigger has aria-haspopup=listbox", () => {
    renderSelect();
    expect(screen.getByRole("combobox")).toHaveAttribute("aria-haspopup", "listbox");
  });

  it("calls onOpenChange when opening", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    renderSelect({ onOpenChange });

    await user.click(screen.getByRole("combobox"));
    expect(onOpenChange).toHaveBeenCalledWith(true);
  });

  it("calls onOpenChange when closing", async () => {
    const user = userEvent.setup();
    const onOpenChange = jest.fn();
    renderSelect({ onOpenChange });

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByTestId("select-overlay"));
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});

/* ========== Selection ========== */

describe("Select — Selection", () => {
  it("selects an item on click and closes dropdown", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "Banana" }));
    // Dropdown should be hidden (aria-hidden)
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
    // Trigger should show selected label
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
  });

  it("displays selected item label in trigger", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Cherry"));
    expect(screen.getByRole("combobox")).toHaveTextContent("Cherry");
  });

  it("calls onValueChange when an item is selected", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    renderSelect({ onValueChange });

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Apple"));
    expect(onValueChange).toHaveBeenCalledWith("apple");
  });

  it("supports controlled value", () => {
    renderSelect({ value: "banana" });
    expect(screen.getByRole("combobox")).toHaveTextContent("Banana");
  });

  it("supports defaultValue (uncontrolled)", () => {
    renderSelect({ defaultValue: "cherry" });
    expect(screen.getByRole("combobox")).toHaveTextContent("Cherry");
  });

  it("does not select a disabled item on click", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    render(
      <Select placeholder="Select" onValueChange={onValueChange}>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>Banana</SelectItem>
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Banana"));
    expect(onValueChange).not.toHaveBeenCalled();
  });

  it("items have role=option", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    expect(screen.getAllByRole("option")).toHaveLength(3);
  });

  it("selected item has aria-selected=true", async () => {
    const user = userEvent.setup();
    renderSelect({ value: "banana" });

    await user.click(screen.getByRole("combobox"));
    const bananaOption = screen.getByRole("option", { name: "Banana" });
    expect(bananaOption).toHaveAttribute("aria-selected", "true");
  });

  it("shows check icon next to selected item", async () => {
    const user = userEvent.setup();
    renderSelect({ value: "apple" });

    await user.click(screen.getByRole("combobox"));
    const appleOption = screen.getByRole("option", { name: "Apple" });
    const svg = appleOption.querySelector("svg");
    expect(svg).toBeInTheDocument();
  });
});

/* ========== Keyboard Navigation ========== */

describe("Select — Keyboard", () => {
  it("ArrowDown opens dropdown when closed", async () => {
    const user = userEvent.setup();
    renderSelect();

    screen.getByRole("combobox").focus();
    await user.keyboard("{ArrowDown}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("ArrowUp opens dropdown when closed", async () => {
    const user = userEvent.setup();
    renderSelect();

    screen.getByRole("combobox").focus();
    await user.keyboard("{ArrowUp}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("Enter opens dropdown when closed", async () => {
    const user = userEvent.setup();
    renderSelect();

    screen.getByRole("combobox").focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("Space opens dropdown when closed", async () => {
    const user = userEvent.setup();
    renderSelect();

    screen.getByRole("combobox").focus();
    await user.keyboard(" ");
    expect(screen.getByRole("listbox")).toBeInTheDocument();
  });

  it("ArrowDown moves highlight to next item", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    // First item should be highlighted by default
    await user.keyboard("{ArrowDown}");
    // Now second item should be highlighted
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("banana");
  });

  it("ArrowUp moves highlight to previous item", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    // Highlight starts on first item, move down then up
    await user.keyboard("{ArrowDown}");
    await user.keyboard("{ArrowUp}");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("apple");
  });

  it("ArrowDown wraps from last to first", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    // Move down 3 times from apple → banana → cherry → wraps to apple
    await user.keyboard("{ArrowDown}{ArrowDown}{ArrowDown}");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("apple");
  });

  it("ArrowUp wraps from first to last", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    // On first item, ArrowUp wraps to last
    await user.keyboard("{ArrowUp}");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("cherry");
  });

  it("Enter selects highlighted item", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    renderSelect({ onValueChange });

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}"); // banana
    await user.keyboard("{Enter}");
    expect(onValueChange).toHaveBeenCalledWith("banana");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("Space selects highlighted item", async () => {
    const user = userEvent.setup();
    const onValueChange = jest.fn();
    renderSelect({ onValueChange });

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}"); // banana
    await user.keyboard(" ");
    expect(onValueChange).toHaveBeenCalledWith("banana");
  });

  it("Home moves to first enabled item", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{ArrowDown}{ArrowDown}"); // cherry
    await user.keyboard("{Home}");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("apple");
  });

  it("End moves to last enabled item", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{End}");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("cherry");
  });

  it("skips disabled items during arrow navigation", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Select">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="banana" disabled>Banana</SelectItem>
        <SelectItem value="cherry">Cherry</SelectItem>
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    // Starts on apple, ArrowDown should skip banana → cherry
    await user.keyboard("{ArrowDown}");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("cherry");
  });
});

/* ========== Typeahead ========== */

describe("Select — Typeahead", () => {
  it("typing a character highlights matching item", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("b");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("banana");
  });

  it("typing multiple characters matches prefix", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("ch");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("cherry");
  });

  it("buffer resets after 500ms", async () => {
    jest.useFakeTimers();
    const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime });
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("c");
    // Wait for buffer to reset
    jest.advanceTimersByTime(600);
    await user.keyboard("a");
    const listbox = screen.getByRole("listbox");
    const activeId = listbox.getAttribute("aria-activedescendant");
    expect(activeId).toContain("apple");
    jest.useRealTimers();
  });
});

/* ========== Form Field ========== */

describe("Select — Form Field", () => {
  it("shows required asterisk when isRequired=true", () => {
    renderSelect({ label: "Fruit", isRequired: true });
    expect(screen.getByText("*")).toBeInTheDocument();
  });

  it("hides asterisk when hideRequiredIndicator=true", () => {
    renderSelect({ label: "Fruit", isRequired: true, hideRequiredIndicator: true });
    expect(screen.queryByText("*")).not.toBeInTheDocument();
  });

  it("shows tooltip icon with title attribute", () => {
    renderSelect({ label: "Fruit", tooltip: "Choose a fruit" });
    expect(screen.getByTitle("Choose a fruit")).toBeInTheDocument();
  });

  it("helper text connected via aria-describedby", () => {
    renderSelect({ helperText: "Pick one", id: "my-select" });
    const trigger = screen.getByRole("combobox");
    expect(trigger).toHaveAttribute("aria-describedby", "my-select-helper");
    expect(screen.getByText("Pick one")).toHaveAttribute("id", "my-select-helper");
  });
});

/* ========== Groups & Separator ========== */

describe("Select — Groups & Separator", () => {
  it("renders SelectGroup with label", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Select">
        <SelectGroup label="Fruits">
          <SelectItem value="apple">Apple</SelectItem>
        </SelectGroup>
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByText("Fruits")).toBeInTheDocument();
    expect(screen.getByRole("group")).toBeInTheDocument();
  });

  it("renders SelectSeparator", async () => {
    const user = userEvent.setup();
    render(
      <Select placeholder="Select">
        <SelectItem value="apple">Apple</SelectItem>
        <SelectSeparator data-testid="separator" />
        <SelectItem value="banana">Banana</SelectItem>
      </Select>,
    );

    await user.click(screen.getByRole("combobox"));
    expect(screen.getByTestId("separator")).toBeInTheDocument();
  });
});

/* ========== Focus Management ========== */

describe("Select — Focus", () => {
  it("returns focus to trigger after selection", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByText("Apple"));
    expect(screen.getByRole("combobox")).toHaveFocus();
  });

  it("returns focus to trigger on Escape", async () => {
    const user = userEvent.setup();
    renderSelect();

    await user.click(screen.getByRole("combobox"));
    await user.keyboard("{Escape}");
    expect(screen.getByRole("combobox")).toHaveFocus();
  });
});
