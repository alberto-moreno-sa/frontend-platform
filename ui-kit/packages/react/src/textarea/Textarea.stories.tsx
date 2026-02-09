import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "./Textarea";

const meta = {
  title: "Components/Textarea",
  component: Textarea,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    variant: { control: "select", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
    isRequired: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========== Default ========== */

export const Default: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a description...",
    helperText: "This is a hint text to help user.",
    isRequired: true,
    tooltip: "A brief description of your project",
  },
};

export const Filled: Story = {
  args: {
    label: "Description",
    defaultValue: "A little about the company and the team that you'll be working with.",
    helperText: "This is a hint text to help user.",
    isRequired: true,
    tooltip: "A brief description of your project",
  },
};

export const Disabled: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a description...",
    helperText: "This is a hint text to help user.",
    isRequired: true,
    tooltip: "A brief description of your project",
    disabled: true,
  },
};

/* ========== Error ========== */

export const ErrorEmpty: Story = {
  args: {
    label: "Description",
    placeholder: "Enter a description...",
    variant: "error",
    helperText: "This is an error message.",
    isRequired: true,
    tooltip: "A brief description of your project",
  },
};

export const ErrorFilled: Story = {
  args: {
    label: "Description",
    defaultValue: "A little about the company and the team that you'll be working with.",
    variant: "error",
    helperText: "This is an error message.",
    isRequired: true,
    tooltip: "A brief description of your project",
  },
};
