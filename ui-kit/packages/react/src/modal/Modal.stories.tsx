import React, { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import {
  Modal,
  ModalHeader,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalDivider,
} from "./Modal";

/* ========== Helper icons ========== */

const CheckCircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const AlertTriangleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
    <line x1="12" y1="9" x2="12" y2="13" />
    <line x1="12" y1="17" x2="12.01" y2="17" />
  </svg>
);

const TrashIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

/* ========== Trigger wrapper ========== */

const ModalTrigger: React.FC<{
  label?: string;
  children: (props: { open: boolean; setOpen: (v: boolean) => void }) => React.ReactNode;
}> = ({ label = "Open Modal", children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
      >
        {label}
      </button>
      {children({ open, setOpen })}
    </>
  );
};

/* ========== Meta ========== */

const meta = {
  title: "Components/Modal",
  component: Modal,
  parameters: { layout: "centered" },
  tags: ["autodocs"],
  argTypes: {
    size: { control: "select", options: ["sm", "md", "lg"] },
    closeOnOverlayClick: { control: "boolean" },
  },
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ========== Default ========== */

export const Default: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger>
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen}>
          <ModalHeader onClose={() => setOpen(false)}>
            <ModalTitle>Modal Title</ModalTitle>
            <ModalDescription>
              This is a description of what this modal does.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-text-tertiary">
              This is the modal body content. You can put any content here including
              forms, text, images, and other components.
            </p>
          </ModalBody>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border-primary px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

/* ========== Sizes ========== */

export const Small: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Open Small">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen} size="sm">
          <ModalHeader onClose={() => setOpen(false)}>
            <ModalTitle>Small Modal</ModalTitle>
            <ModalDescription>A compact modal for simple actions.</ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-text-tertiary">
              Small modals are ideal for confirmations and brief messages.
            </p>
          </ModalBody>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border-primary px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

export const Large: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Open Large">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen} size="lg">
          <ModalHeader onClose={() => setOpen(false)}>
            <ModalTitle>Large Modal</ModalTitle>
            <ModalDescription>
              A larger modal for complex content and forms.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-text-tertiary">
              Large modals provide more room for complex forms, settings panels,
              and detailed content that requires more space.
            </p>
          </ModalBody>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border-primary px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Save changes
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

/* ========== With featured icon ========== */

export const WithSuccessIcon: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Success Modal">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen} size="sm">
          <ModalHeader
            onClose={() => setOpen(false)}
            icon={
              <ModalIcon variant="success">
                <CheckCircleIcon className="size-5" />
              </ModalIcon>
            }
          >
            <ModalTitle>Blog post published</ModalTitle>
            <ModalDescription>
              This blog post has been published. Team members will be able to edit
              this post and republish changes.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border-primary px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Confirm
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

export const WithWarningIcon: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Warning Modal">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen} size="sm">
          <ModalHeader
            onClose={() => setOpen(false)}
            icon={
              <ModalIcon variant="warning">
                <AlertTriangleIcon className="size-5" />
              </ModalIcon>
            }
          >
            <ModalTitle>Unsaved changes</ModalTitle>
            <ModalDescription>
              You have unsaved changes. Are you sure you want to leave this page?
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border-primary px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-xs"
            >
              Stay
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-warning-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Leave
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

/* ========== Destructive ========== */

export const Destructive: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Delete Modal">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen} size="sm">
          <ModalHeader
            onClose={() => setOpen(false)}
            icon={
              <ModalIcon variant="error">
                <TrashIcon className="size-5" />
              </ModalIcon>
            }
          >
            <ModalTitle>Delete project</ModalTitle>
            <ModalDescription>
              Are you sure you want to delete this project? This action cannot be
              undone.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border-primary px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-error-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Delete
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

/* ========== With divider ========== */

export const WithDivider: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Divider Modal">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen}>
          <ModalHeader onClose={() => setOpen(false)}>
            <ModalTitle>Account settings</ModalTitle>
            <ModalDescription>Update your account preferences.</ModalDescription>
          </ModalHeader>
          <ModalDivider />
          <ModalBody>
            <p className="text-sm text-text-tertiary">
              Form fields and settings would go here. The dividers separate the
              header, body, and footer visually.
            </p>
          </ModalBody>
          <ModalDivider />
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg border border-border-primary px-4 py-2.5 text-sm font-semibold text-text-secondary shadow-xs"
            >
              Cancel
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Save
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

/* ========== Header only ========== */

export const HeaderOnly: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Header Only">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen} size="sm">
          <ModalHeader
            onClose={() => setOpen(false)}
            icon={
              <ModalIcon variant="success">
                <CheckCircleIcon className="size-5" />
              </ModalIcon>
            }
          >
            <ModalTitle>Action completed</ModalTitle>
            <ModalDescription>
              Your changes have been saved successfully.
            </ModalDescription>
          </ModalHeader>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Done
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};

/* ========== No overlay close ========== */

export const NoOverlayClose: Story = {
  args: { open: false, onOpenChange: () => {}, children: null },
  render: () => (
    <ModalTrigger label="Persistent Modal">
      {({ open, setOpen }) => (
        <Modal open={open} onOpenChange={setOpen} closeOnOverlayClick={false}>
          <ModalHeader onClose={() => setOpen(false)}>
            <ModalTitle>Important</ModalTitle>
            <ModalDescription>
              This modal only closes via the X button or Escape key, not overlay click.
            </ModalDescription>
          </ModalHeader>
          <ModalBody>
            <p className="text-sm text-text-tertiary">
              Use closeOnOverlayClick=false for modals that require explicit user action.
            </p>
          </ModalBody>
          <ModalFooter className="justify-end">
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-xs"
            >
              Got it
            </button>
          </ModalFooter>
        </Modal>
      )}
    </ModalTrigger>
  ),
};
