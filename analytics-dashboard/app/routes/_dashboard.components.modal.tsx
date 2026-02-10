import { useState } from "react";
import type { MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import {
  Modal,
  ModalHeader,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalDivider,
  Button,
} from "@ahiggs-ui/react";
import { ShowcaseSection } from "~/components/showcase/ShowcaseSection";

const CheckIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const AlertIcon = () => (
  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <line x1="12" y1="16" x2="12.01" y2="16" />
  </svg>
);

export const meta: MetaFunction = () => [{ title: "Modal | Components" }];

function ModalDemo({
  label,
  size,
  iconVariant,
  icon,
  noOverlayClose,
}: {
  label: string;
  size?: "sm" | "md" | "lg";
  iconVariant?: "brand" | "success" | "error" | "warning" | "gray";
  icon?: React.ReactNode;
  noOverlayClose?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button variant="secondaryGray" onClick={() => setOpen(true)}>
        {t("showcase.openModal")}: {label}
      </Button>
      <Modal open={open} onOpenChange={setOpen} size={size} closeOnOverlayClick={!noOverlayClose}>
        <ModalHeader onClose={() => setOpen(false)}>
          {iconVariant && icon && <ModalIcon variant={iconVariant}>{icon}</ModalIcon>}
          <ModalTitle>{label}</ModalTitle>
          <ModalDescription>This is a {label.toLowerCase()} modal example.</ModalDescription>
        </ModalHeader>
        <ModalBody>
          <p className="text-sm text-text-secondary">
            Modal body content goes here. You can place any content inside.
          </p>
        </ModalBody>
        <ModalFooter>
          <Button variant="secondaryGray" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}

export default function ModalShowcase() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("dashboard.nav.modal")}</h1>

      <ShowcaseSection title={t("showcase.sizes")}>
        <ModalDemo label="Small" size="sm" />
        <ModalDemo label="Medium" size="md" />
        <ModalDemo label="Large" size="lg" />
      </ShowcaseSection>

      <ShowcaseSection title="Icon Variants">
        <ModalDemo label="Brand" iconVariant="brand" icon={<CheckIcon />} />
        <ModalDemo label="Success" iconVariant="success" icon={<CheckIcon />} />
        <ModalDemo label="Error" iconVariant="error" icon={<AlertIcon />} />
        <ModalDemo label="Warning" iconVariant="warning" icon={<AlertIcon />} />
        <ModalDemo label="Gray" iconVariant="gray" icon={<AlertIcon />} />
      </ShowcaseSection>

      <ShowcaseSection title="With Divider">
        <ModalDividerDemo />
      </ShowcaseSection>

      <ShowcaseSection title="No Overlay Close">
        <ModalDemo label="No Overlay Close" noOverlayClose />
      </ShowcaseSection>
    </div>
  );
}

function ModalDividerDemo() {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();

  return (
    <>
      <Button variant="secondaryGray" onClick={() => setOpen(true)}>
        {t("showcase.openModal")}: With Divider
      </Button>
      <Modal open={open} onOpenChange={setOpen}>
        <ModalHeader onClose={() => setOpen(false)}>
          <ModalTitle>With Dividers</ModalTitle>
          <ModalDescription>Modal with dividers separating sections.</ModalDescription>
        </ModalHeader>
        <ModalDivider />
        <ModalBody>
          <p className="text-sm text-text-secondary">
            Content between dividers for clear visual separation.
          </p>
        </ModalBody>
        <ModalDivider />
        <ModalFooter>
          <Button variant="secondaryGray" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={() => setOpen(false)}>Confirm</Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
