import React from "react";
import type { Meta, StoryObj } from "@storybook/react";
import { Button, CloseButton } from "./Button";

/* ========== Helper icons ========== */

const CircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <circle cx="10" cy="10" r="7.5" />
  </svg>
);

const PlusIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M10 4.167v11.666M4.167 10h11.666" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M2.5 5h15M6.667 5V3.333a1.667 1.667 0 0 1 1.666-1.666h3.334a1.667 1.667 0 0 1 1.666 1.666V5m2.5 0v11.667a1.667 1.667 0 0 1-1.666 1.666H5.833a1.667 1.667 0 0 1-1.666-1.666V5h11.666Z" />
  </svg>
);

/* ========== Button meta ========== */

const meta = {
  title: "Components/Button",
  component: Button,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: [
        "primary",
        "secondaryGray",
        "secondaryColor",
        "tertiaryGray",
        "tertiaryColor",
        "linkGray",
        "linkColor",
      ],
    },
    size: { control: "select", options: ["sm", "md", "lg", "xl", "2xl"] },
    destructive: { control: "boolean" },
    disabled: { control: "boolean" },
    loading: { control: "boolean" },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========== Primary variants ========== */

export const Primary: Story = {
  args: { children: "Button CTA", variant: "primary" },
};

export const PrimaryWithIcons: Story = {
  args: {
    children: "Button CTA",
    variant: "primary",
    leadingIcon: CircleIcon,
    trailingIcon: CircleIcon,
  },
};

export const PrimaryIconOnly: Story = {
  args: { variant: "primary", leadingIcon: CircleIcon },
};

/* ========== Secondary Gray ========== */

export const SecondaryGray: Story = {
  args: { children: "Button CTA", variant: "secondaryGray" },
};

export const SecondaryGrayWithIcons: Story = {
  args: {
    children: "Button CTA",
    variant: "secondaryGray",
    leadingIcon: CircleIcon,
    trailingIcon: CircleIcon,
  },
};

/* ========== Secondary Color ========== */

export const SecondaryColor: Story = {
  args: { children: "Button CTA", variant: "secondaryColor" },
};

export const SecondaryColorWithIcons: Story = {
  args: {
    children: "Button CTA",
    variant: "secondaryColor",
    leadingIcon: CircleIcon,
    trailingIcon: CircleIcon,
  },
};

/* ========== Tertiary Gray ========== */

export const TertiaryGray: Story = {
  args: { children: "Button CTA", variant: "tertiaryGray" },
};

export const TertiaryGrayWithIcons: Story = {
  args: {
    children: "Button CTA",
    variant: "tertiaryGray",
    leadingIcon: CircleIcon,
    trailingIcon: CircleIcon,
  },
};

/* ========== Tertiary Color ========== */

export const TertiaryColor: Story = {
  args: { children: "Button CTA", variant: "tertiaryColor" },
};

/* ========== Link Gray ========== */

export const LinkGray: Story = {
  args: { children: "Button CTA", variant: "linkGray" },
};

export const LinkGrayWithIcons: Story = {
  args: {
    children: "Button CTA",
    variant: "linkGray",
    leadingIcon: CircleIcon,
    trailingIcon: CircleIcon,
  },
};

/* ========== Link Color ========== */

export const LinkColor: Story = {
  args: { children: "Button CTA", variant: "linkColor" },
};

/* ========== Sizes ========== */

export const SizeSmall: Story = {
  args: { children: "Button CTA", size: "sm", leadingIcon: CircleIcon },
};

export const SizeMedium: Story = {
  args: { children: "Button CTA", size: "md", leadingIcon: CircleIcon },
};

export const SizeLarge: Story = {
  args: { children: "Button CTA", size: "lg", leadingIcon: CircleIcon },
};

export const SizeXL: Story = {
  args: { children: "Button CTA", size: "xl", leadingIcon: CircleIcon },
};

export const Size2XL: Story = {
  args: { children: "Button CTA", size: "2xl", leadingIcon: CircleIcon },
};

/* ========== Destructive ========== */

export const DestructivePrimary: Story = {
  args: {
    children: "Delete item",
    variant: "primary",
    destructive: true,
    leadingIcon: TrashIcon,
  },
};

export const DestructiveSecondaryGray: Story = {
  args: {
    children: "Delete item",
    variant: "secondaryGray",
    destructive: true,
    leadingIcon: TrashIcon,
  },
};

export const DestructiveSecondaryColor: Story = {
  args: {
    children: "Delete item",
    variant: "secondaryColor",
    destructive: true,
    leadingIcon: TrashIcon,
  },
};

export const DestructiveTertiaryGray: Story = {
  args: {
    children: "Delete item",
    variant: "tertiaryGray",
    destructive: true,
    leadingIcon: TrashIcon,
  },
};

export const DestructiveLinkColor: Story = {
  args: {
    children: "Delete item",
    variant: "linkColor",
    destructive: true,
  },
};

/* ========== Loading ========== */

export const Loading: Story = {
  args: {
    children: "Button CTA",
    loading: true,
    loadingText: "Submitting...",
  },
};

export const LoadingSecondary: Story = {
  args: {
    children: "Button CTA",
    variant: "secondaryGray",
    loading: true,
    loadingText: "Submitting...",
  },
};

export const LoadingDestructive: Story = {
  args: {
    children: "Delete",
    variant: "primary",
    destructive: true,
    loading: true,
    loadingText: "Submitting...",
  },
};

/* ========== Disabled ========== */

export const Disabled: Story = {
  args: { children: "Button CTA", disabled: true },
};

export const DisabledSecondary: Story = {
  args: { children: "Button CTA", variant: "secondaryGray", disabled: true },
};

export const DisabledDestructive: Story = {
  args: {
    children: "Delete",
    variant: "primary",
    destructive: true,
    disabled: true,
  },
};

/* ========== Icon-only ========== */

export const IconOnly: Story = {
  args: { leadingIcon: PlusIcon, "aria-label": "Add item" },
};

export const IconOnlySecondary: Story = {
  args: {
    leadingIcon: PlusIcon,
    variant: "secondaryGray",
    "aria-label": "Add item",
  },
};

export const IconOnlyDestructive: Story = {
  args: {
    leadingIcon: TrashIcon,
    variant: "primary",
    destructive: true,
    "aria-label": "Delete item",
  },
};

/* ========== Hierarchy showcase ========== */

export const Hierarchy: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary" leadingIcon={CircleIcon}>
        Primary
      </Button>
      <Button variant="secondaryGray" leadingIcon={CircleIcon}>
        Secondary
      </Button>
      <Button variant="tertiaryGray" leadingIcon={CircleIcon}>
        Tertiary
      </Button>
      <Button variant="linkGray" leadingIcon={CircleIcon}>
        Link
      </Button>
    </div>
  ),
};

export const DestructiveHierarchy: Story = {
  render: () => (
    <div className="flex items-center gap-3">
      <Button variant="primary" destructive leadingIcon={TrashIcon}>
        Delete
      </Button>
      <Button variant="secondaryGray" destructive leadingIcon={TrashIcon}>
        Delete
      </Button>
      <Button variant="tertiaryGray" destructive leadingIcon={TrashIcon}>
        Delete
      </Button>
      <Button variant="linkColor" destructive>
        Delete
      </Button>
    </div>
  ),
};

export const AllSizes: Story = {
  render: () => (
    <div className="flex items-end gap-3">
      <Button size="sm" leadingIcon={CircleIcon}>
        Small
      </Button>
      <Button size="md" leadingIcon={CircleIcon}>
        Medium
      </Button>
      <Button size="lg" leadingIcon={CircleIcon}>
        Large
      </Button>
      <Button size="xl" leadingIcon={CircleIcon}>
        XL
      </Button>
      <Button size="2xl" leadingIcon={CircleIcon}>
        2XL
      </Button>
    </div>
  ),
};

/* ========== CloseButton stories ========== */

export const Close: StoryObj = {
  render: () => (
    <div className="flex items-center gap-3">
      <CloseButton size="sm" />
      <CloseButton size="md" />
      <CloseButton size="lg" />
    </div>
  ),
};

export const CloseDisabled: StoryObj = {
  render: () => <CloseButton disabled />,
};
