import type { Meta, StoryObj } from "@storybook/react";
import {
  Card,
  CardImage,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDivider,
} from "./Card";

/* ========== Meta ========== */

const meta = {
  title: "Components/Card",
  component: Card,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "elevated", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["default", "sm"],
    },
    interactive: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <div style={{ width: 380 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========== Basic ========== */

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">
          This is the card content area. You can put any content here.
        </p>
      </CardContent>
      <CardFooter>
        <button className="text-sm font-semibold text-brand-700">Learn more</button>
      </CardFooter>
    </Card>
  ),
};

export const Elevated: Story = {
  args: { variant: "elevated" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>With a more prominent shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">Elevated card content.</p>
      </CardContent>
    </Card>
  ),
};

export const Outline: Story = {
  args: { variant: "outline" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Outline Card</CardTitle>
        <CardDescription>No shadow, stronger border.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">Outline card content.</p>
      </CardContent>
    </Card>
  ),
};

export const Ghost: Story = {
  args: { variant: "ghost" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Ghost Card</CardTitle>
        <CardDescription>No border, no shadow.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">Ghost card content.</p>
      </CardContent>
    </Card>
  ),
};

/* ========== Size ========== */

export const Small: Story = {
  args: { size: "sm" },
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Compact Card</CardTitle>
        <CardDescription>Smaller padding throughout.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">Compact content area.</p>
      </CardContent>
      <CardFooter>
        <button className="text-sm font-semibold text-brand-700">Action</button>
      </CardFooter>
    </Card>
  ),
};

/* ========== With image ========== */

export const WithImageTop: Story = {
  render: (args) => (
    <Card {...args}>
      <CardImage
        src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&h=300&fit=crop"
        alt="Mountain landscape"
        height="md"
      />
      <CardHeader>
        <CardTitle>Mountain Escape</CardTitle>
        <CardDescription>Discover breathtaking views.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">
          Plan your next adventure with our curated mountain trails and lodges.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithImageLarge: Story = {
  render: (args) => (
    <Card {...args}>
      <CardImage
        src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600&h=400&fit=crop"
        alt="Forest path"
        height="lg"
      />
      <CardHeader>
        <CardTitle>Nature Walk</CardTitle>
        <CardDescription>Find peace in the forest.</CardDescription>
      </CardHeader>
      <CardFooter>
        <button className="text-sm font-semibold text-brand-700">Explore</button>
      </CardFooter>
    </Card>
  ),
};

/* ========== With action ========== */

export const WithAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader
        action={
          <button className="rounded-lg border border-border-primary px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-xs">
            Edit
          </button>
        }
      >
        <CardTitle>Project Settings</CardTitle>
        <CardDescription>Manage your project configuration.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">
          Configure project name, description, and visibility settings.
        </p>
      </CardContent>
    </Card>
  ),
};

/* ========== With divider ========== */

export const WithDivider: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>Manage your account settings.</CardDescription>
      </CardHeader>
      <CardDivider />
      <CardContent>
        <p className="text-sm text-text-tertiary">
          Update your profile information, change password, and manage notifications.
        </p>
      </CardContent>
      <CardDivider />
      <CardFooter className="justify-end">
        <button className="rounded-lg border border-border-primary px-3 py-1.5 text-sm font-semibold text-text-secondary shadow-xs">
          Cancel
        </button>
        <button className="rounded-lg bg-brand-600 px-3 py-1.5 text-sm font-semibold text-white shadow-xs">
          Save
        </button>
      </CardFooter>
    </Card>
  ),
};

/* ========== Interactive ========== */

export const Interactive: Story = {
  args: { interactive: true },
  render: (args) => (
    <Card {...args} onClick={() => alert("Card clicked!")}>
      <CardHeader>
        <CardTitle>Clickable Card</CardTitle>
        <CardDescription>Click or focus this card. Has hover and focus ring.</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-text-tertiary">
          Interactive cards support hover shadow and focus ring for keyboard navigation.
        </p>
      </CardContent>
    </Card>
  ),
};

/* ========== Header only ========== */

export const HeaderOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Simple Card</CardTitle>
        <CardDescription>Just a header, no body or footer needed.</CardDescription>
      </CardHeader>
    </Card>
  ),
};

/* ========== Content only ========== */

export const ContentOnly: Story = {
  render: (args) => (
    <Card {...args}>
      <CardContent>
        <p className="text-sm text-text-tertiary">
          A card with only content — no header or footer.
        </p>
      </CardContent>
    </Card>
  ),
};

/* ========== Variant showcase ========== */

export const AllVariants: Story = {
  decorators: [
    (Story) => (
      <div style={{ width: 800 }}>
        <Story />
      </div>
    ),
  ],
  render: () => (
    <div className="grid grid-cols-2 gap-4">
      {(["default", "elevated", "outline", "ghost"] as const).map((v) => (
        <Card key={v} variant={v}>
          <CardHeader>
            <CardTitle>{v}</CardTitle>
            <CardDescription>variant=&quot;{v}&quot;</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-text-tertiary">Card content area.</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};
