import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "./Input";

const MailIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <rect x="2" y="4" width="16" height="12" rx="2" />
    <path d="m2 4 8 5 8-5" />
  </svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="9" cy="9" r="6" />
    <path d="m13.5 13.5 3 3" />
  </svg>
);

const meta = {
  title: "Components/Input",
  component: Input,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    variant: { control: "select", options: ["default", "error", "success"] },
    disabled: { control: "boolean" },
    isRequired: { control: "boolean" },
    hideRequiredIndicator: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 320 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========== Basic ========== */

export const Default: Story = {
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
    helperText: "This is a hint text to help user.",
    isRequired: true,
    tooltip: "Your primary email address",
    icon: MailIcon,
  },
};

export const Filled: Story = {
  args: {
    label: "Email",
    defaultValue: "olivia@untitledui.com",
    helperText: "This is a hint text to help user.",
    isRequired: true,
    tooltip: "Your primary email address",
    icon: MailIcon,
  },
};

export const Disabled: Story = {
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
    helperText: "This is a hint text to help user.",
    isRequired: true,
    tooltip: "Your primary email address",
    icon: MailIcon,
    disabled: true,
  },
};

/* ========== Error ========== */

export const ErrorEmpty: Story = {
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
    variant: "error",
    helperText: "This is an error message.",
    isRequired: true,
    tooltip: "Your primary email address",
    icon: MailIcon,
  },
};

export const ErrorFilled: Story = {
  args: {
    label: "Email",
    defaultValue: "olivia@untitledui.com",
    variant: "error",
    helperText: "This is an error message.",
    isRequired: true,
    tooltip: "Your primary email address",
    icon: MailIcon,
  },
};

/* ========== Sizes ========== */

export const Small: Story = {
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
    size: "small",
    icon: MailIcon,
    helperText: "This is a hint text to help user.",
  },
};

export const Large: Story = {
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
    size: "large",
    icon: MailIcon,
    helperText: "This is a hint text to help user.",
  },
};

/* ========== Features ========== */

export const WithoutIcon: Story = {
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
    helperText: "This is a hint text to help user.",
  },
};

export const WithShortcut: Story = {
  args: {
    placeholder: "Search...",
    icon: SearchIcon,
    shortcut: true,
  },
};

export const WithCustomShortcut: Story = {
  args: {
    label: "Search",
    placeholder: "Search...",
    shortcut: "⌘S",
  },
};

export const RequiredHidden: Story = {
  args: {
    label: "Email",
    placeholder: "olivia@untitledui.com",
    isRequired: true,
    hideRequiredIndicator: true,
  },
};
