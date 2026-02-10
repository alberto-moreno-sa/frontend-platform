import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ahiggs-ui/utils";
import {
  overlayStyles,
  modalStyles,
  modalHeaderStyles,
  modalIconStyles,
  modalTitleStyles,
  modalDescriptionStyles,
  modalBodyStyles,
  modalFooterStyles,
  modalDividerStyles,
  modalCloseButtonStyles,
} from "./Modal.styles";

/* ========== Modal ========== */

export interface ModalProps extends VariantProps<typeof modalStyles> {
  /** Whether the modal is open. */
  open: boolean;
  /** Callback when open state changes (close via X, overlay, or Escape). */
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
  className?: string;
  /** Close when the overlay/backdrop is clicked. Defaults to true. */
  closeOnOverlayClick?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  open,
  onOpenChange,
  size,
  className,
  children,
  closeOnOverlayClick = true,
}) => {
  React.useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <>
      <div
        className={cx(overlayStyles())}
        onClick={closeOnOverlayClick ? () => onOpenChange(false) : undefined}
        aria-hidden="true"
        data-testid="modal-overlay"
      />
      <div
        role="dialog"
        aria-modal="true"
        className={cx(modalStyles({ size }), className)}
      >
        {children}
      </div>
    </>
  );
};

Modal.displayName = "Modal";

/* ========== ModalHeader ========== */

export interface ModalHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Show close (X) button. Provide the onClose callback. */
  onClose?: () => void;
  /** Featured icon element rendered before the title/description block. */
  icon?: React.ReactNode;
}

const ModalHeader = React.forwardRef<HTMLDivElement, ModalHeaderProps>(
  ({ className, children, onClose, icon, ...props }, ref) => (
    <div ref={ref} className={cx(modalHeaderStyles(), className)} {...props}>
      {icon && <div className="shrink-0">{icon}</div>}
      <div className="flex min-w-0 flex-1 flex-col">{children}</div>
      {onClose && (
        <button
          type="button"
          className={cx(modalCloseButtonStyles())}
          onClick={onClose}
          aria-label="Close"
        >
          <CloseIcon />
        </button>
      )}
    </div>
  ),
);
ModalHeader.displayName = "ModalHeader";

/* ========== ModalIcon (featured icon) ========== */

export interface ModalIconProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof modalIconStyles> {
  children: React.ReactNode;
}

const ModalIcon = React.forwardRef<HTMLDivElement, ModalIconProps>(
  ({ className, variant, size, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cx(modalIconStyles({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  ),
);
ModalIcon.displayName = "ModalIcon";

/* ========== ModalTitle ========== */

export type ModalTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const ModalTitle = React.forwardRef<HTMLHeadingElement, ModalTitleProps>(
  ({ className, children, ...props }, ref) => (
    <h2 ref={ref} className={cx(modalTitleStyles(), className)} {...props}>
      {children}
    </h2>
  ),
);
ModalTitle.displayName = "ModalTitle";

/* ========== ModalDescription ========== */

export type ModalDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const ModalDescription = React.forwardRef<HTMLParagraphElement, ModalDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cx(modalDescriptionStyles(), className)} {...props} />
  ),
);
ModalDescription.displayName = "ModalDescription";

/* ========== ModalBody ========== */

export type ModalBodyProps = React.HTMLAttributes<HTMLDivElement>;

const ModalBody = React.forwardRef<HTMLDivElement, ModalBodyProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx(modalBodyStyles(), className)} {...props} />
  ),
);
ModalBody.displayName = "ModalBody";

/* ========== ModalFooter ========== */

export type ModalFooterProps = React.HTMLAttributes<HTMLDivElement>;

const ModalFooter = React.forwardRef<HTMLDivElement, ModalFooterProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cx(modalFooterStyles(), className)} {...props} />
  ),
);
ModalFooter.displayName = "ModalFooter";

/* ========== ModalDivider ========== */

export type ModalDividerProps = React.HTMLAttributes<HTMLHRElement>;

const ModalDivider = React.forwardRef<HTMLHRElement, ModalDividerProps>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cx(modalDividerStyles(), className)} {...props} />
  ),
);
ModalDivider.displayName = "ModalDivider";

export {
  Modal,
  ModalHeader,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalDivider,
};

/* ========== Inline SVG ========== */

const CloseIcon = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);
