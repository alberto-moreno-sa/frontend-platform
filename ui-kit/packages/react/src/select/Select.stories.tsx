import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Select, SelectItem, SelectGroup, SelectSeparator } from "./Select";

const meta = {
  title: "Components/Select",
  component: Select,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    variant: { control: "select", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    hideRequiredIndicator: { control: "boolean" },
    placeholder: { control: "text" },
    label: { control: "text" },
    helperText: { control: "text" },
    tooltip: { control: "text" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========== Stories ========== */

export const Default: Story = {
  args: {
    label: "Team member",
    placeholder: "Select team member",
    helperText: "This is a hint text to help user.",
    isRequired: true,
    tooltip: "Select a team member from the list",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="olivia">Olivia Rhye</SelectItem>
      <SelectItem value="phoenix">Phoenix Baker</SelectItem>
      <SelectItem value="lana">Lana Steiner</SelectItem>
      <SelectItem value="demi">Demi Wilkinson</SelectItem>
      <SelectItem value="candice">Candice Wu</SelectItem>
    </Select>
  ),
};

export const WithValue: Story = {
  args: {
    label: "Team member",
    placeholder: "Select team member",
    defaultValue: "phoenix",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="olivia">Olivia Rhye</SelectItem>
      <SelectItem value="phoenix">Phoenix Baker</SelectItem>
      <SelectItem value="lana">Lana Steiner</SelectItem>
      <SelectItem value="demi">Demi Wilkinson</SelectItem>
    </Select>
  ),
};

export const Disabled: Story = {
  args: {
    label: "Team member",
    placeholder: "Select team member",
    disabled: true,
    defaultValue: "phoenix",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="olivia">Olivia Rhye</SelectItem>
      <SelectItem value="phoenix">Phoenix Baker</SelectItem>
      <SelectItem value="lana">Lana Steiner</SelectItem>
    </Select>
  ),
};

export const ErrorEmpty: Story = {
  args: {
    label: "Team member",
    placeholder: "Select team member",
    variant: "error",
    helperText: "This field is required.",
    isRequired: true,
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="olivia">Olivia Rhye</SelectItem>
      <SelectItem value="phoenix">Phoenix Baker</SelectItem>
    </Select>
  ),
};

export const ErrorFilled: Story = {
  args: {
    label: "Team member",
    placeholder: "Select team member",
    variant: "error",
    helperText: "Invalid selection.",
    defaultValue: "olivia",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="olivia">Olivia Rhye</SelectItem>
      <SelectItem value="phoenix">Phoenix Baker</SelectItem>
    </Select>
  ),
};

export const Small: Story = {
  args: {
    label: "Size",
    placeholder: "Select size",
    size: "small",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="xs">Extra Small</SelectItem>
      <SelectItem value="sm">Small</SelectItem>
      <SelectItem value="md">Medium</SelectItem>
      <SelectItem value="lg">Large</SelectItem>
    </Select>
  ),
};

export const Large: Story = {
  args: {
    label: "Size",
    placeholder: "Select size",
    size: "large",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="xs">Extra Small</SelectItem>
      <SelectItem value="sm">Small</SelectItem>
      <SelectItem value="md">Medium</SelectItem>
      <SelectItem value="lg">Large</SelectItem>
    </Select>
  ),
};

export const WithGroups: Story = {
  args: {
    label: "Team member",
    placeholder: "Select team member",
  },
  render: (args) => (
    <Select {...args}>
      <SelectGroup label="Engineering">
        <SelectItem value="olivia">Olivia Rhye</SelectItem>
        <SelectItem value="phoenix">Phoenix Baker</SelectItem>
      </SelectGroup>
      <SelectSeparator />
      <SelectGroup label="Design">
        <SelectItem value="lana">Lana Steiner</SelectItem>
        <SelectItem value="demi">Demi Wilkinson</SelectItem>
      </SelectGroup>
    </Select>
  ),
};

export const ManyItems: Story = {
  args: {
    label: "Country",
    placeholder: "Select country",
  },
  render: (args) => (
    <Select {...args}>
      {[
        "Argentina",
        "Australia",
        "Brazil",
        "Canada",
        "Chile",
        "China",
        "Colombia",
        "France",
        "Germany",
        "India",
        "Italy",
        "Japan",
        "Mexico",
        "Netherlands",
        "Portugal",
        "South Korea",
        "Spain",
        "Sweden",
        "United Kingdom",
        "United States",
      ].map((country) => (
        <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, "-")}>
          {country}
        </SelectItem>
      ))}
    </Select>
  ),
};

export const Controlled: Story = {
  args: {
    label: "Fruit",
    placeholder: "Select fruit",
  },
  render: (args) => {
    const [value, setValue] = useState<string | undefined>(undefined);
    return (
      <div className="flex flex-col gap-4">
        <Select {...args} value={value} onValueChange={setValue}>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="banana">Banana</SelectItem>
          <SelectItem value="cherry">Cherry</SelectItem>
        </Select>
        <p className="text-sm text-text-tertiary">
          Selected: {value ?? "none"}
        </p>
      </div>
    );
  },
};

export const WithoutLabel: Story = {
  args: {
    placeholder: "Select option",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="opt1">Option 1</SelectItem>
      <SelectItem value="opt2">Option 2</SelectItem>
      <SelectItem value="opt3">Option 3</SelectItem>
    </Select>
  ),
};

export const DisabledItems: Story = {
  args: {
    label: "Team member",
    placeholder: "Select team member",
  },
  render: (args) => (
    <Select {...args}>
      <SelectItem value="olivia">Olivia Rhye</SelectItem>
      <SelectItem value="phoenix" disabled>Phoenix Baker (unavailable)</SelectItem>
      <SelectItem value="lana">Lana Steiner</SelectItem>
      <SelectItem value="demi" disabled>Demi Wilkinson (unavailable)</SelectItem>
      <SelectItem value="candice">Candice Wu</SelectItem>
    </Select>
  ),
};
