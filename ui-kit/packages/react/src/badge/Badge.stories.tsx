import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./Badge";

const meta = {
  title: "Components/Badge",
  component: Badge,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    intent: {
      control: "select",
      options: ["default", "secondary", "destructive", "outline", "success", "warning"],
    },
    size: { control: "select", options: ["small", "medium", "large"] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: { children: "Badge" },
};

export const Secondary: Story = {
  args: { children: "Secondary", intent: "secondary" },
};

export const Destructive: Story = {
  args: { children: "Error", intent: "destructive" },
};

export const Outline: Story = {
  args: { children: "Outline", intent: "outline" },
};

export const Success: Story = {
  args: { children: "Active", intent: "success" },
};

export const Warning: Story = {
  args: { children: "Pending", intent: "warning" },
};

export const Small: Story = {
  args: { children: "Small", size: "small" },
};

export const Large: Story = {
  args: { children: "Large", size: "large" },
};
