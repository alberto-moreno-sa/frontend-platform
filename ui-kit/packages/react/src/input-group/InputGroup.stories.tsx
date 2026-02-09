import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "../input/Input";
import { InputGroup, InputPrefix } from "./InputGroup";

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
  title: "Components/InputGroup",
  component: InputGroup,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["small", "medium", "large"] },
    isInvalid: { control: "boolean" },
    isRequired: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 400 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof InputGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const WithPrefix: Story = {
  args: {
    label: "Website",
    prefix: "https://",
    children: <Input placeholder="www.example.com" />,
  },
};

export const WithLabelAndHint: Story = {
  args: {
    label: "Website",
    hint: "Enter your company website URL",
    isRequired: true,
    children: <Input placeholder="www.example.com" />,
  },
};

export const WithLeadingAddon: Story = {
  args: {
    label: "Amount",
    leadingAddon: (
      <InputPrefix position="leading" size="medium">
        $
      </InputPrefix>
    ),
    children: <Input placeholder="0.00" type="number" />,
  },
};

export const WithTrailingAddon: Story = {
  render: () => (
    <InputGroup
      label="Search"
      trailingAddon={
        <button
          type="button"
          style={{
            padding: "8px 16px",
            borderRadius: "0 8px 8px 0",
            border: "1px solid #d0d5dd",
            borderLeft: "none",
            background: "#f9fafb",
            cursor: "pointer",
          }}
        >
          Go
        </button>
      }
    >
      <Input placeholder="Search..." icon={SearchIcon} />
    </InputGroup>
  ),
};

export const Invalid: Story = {
  args: {
    label: "Email",
    hint: "This field is required",
    isInvalid: true,
    isRequired: true,
    children: <Input variant="error" placeholder="name@example.com" />,
  },
};
