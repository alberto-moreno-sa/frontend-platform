import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ui-kit/utils";
import {
  cardStyles,
  cardImageStyles,
  cardHeaderStyles,
  cardActionStyles,
  cardTitleStyles,
  cardDescriptionStyles,
  cardContentStyles,
  cardFooterStyles,
  cardDividerStyles,
} from "./Card.styles";

/* ========== Shared size context ========== */

type CardSize = "default" | "sm";

const CardSizeContext = React.createContext<CardSize>("default");

/* ========== Card ========== */

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardStyles> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, size = "default", interactive, ...props }, ref) => (
    <CardSizeContext.Provider value={size ?? "default"}>
      <div
        ref={ref}
        className={cx(cardStyles({ variant, size, interactive: !!interactive }), className)}
        tabIndex={interactive ? 0 : undefined}
        {...props}
      />
    </CardSizeContext.Provider>
  ),
);
Card.displayName = "Card";

/* ========== CardImage ========== */

export interface CardImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, "height">,
    VariantProps<typeof cardImageStyles> {}

const CardImage = React.forwardRef<HTMLImageElement, CardImageProps>(
  ({ className, position, height, alt = "", ...props }, ref) => (
    <img
      ref={ref}
      className={cx(cardImageStyles({ position, height }), className)}
      alt={alt}
      {...props}
    />
  ),
);
CardImage.displayName = "CardImage";

/* ========== CardHeader ========== */

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Action element rendered in the top-right corner of the header. */
  action?: React.ReactNode;
}

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, action, children, ...props }, ref) => {
    const size = React.useContext(CardSizeContext);
    return (
      <div
        ref={ref}
        className={cx(cardHeaderStyles({ size, hasAction: !!action }), className)}
        {...props}
      >
        {action ? <div className="flex flex-col gap-1">{children}</div> : children}
        {action && <div className={cx(cardActionStyles())}>{action}</div>}
      </div>
    );
  },
);
CardHeader.displayName = "CardHeader";

/* ========== CardTitle ========== */

export type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, children, ...props }, ref) => {
    const size = React.useContext(CardSizeContext);
    return (
      <h3 ref={ref} className={cx(cardTitleStyles({ size }), className)} {...props}>
        {children}
      </h3>
    );
  },
);
CardTitle.displayName = "CardTitle";

/* ========== CardDescription ========== */

export type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => {
    const size = React.useContext(CardSizeContext);
    return (
      <p ref={ref} className={cx(cardDescriptionStyles({ size }), className)} {...props} />
    );
  },
);
CardDescription.displayName = "CardDescription";

/* ========== CardContent ========== */

export type CardContentProps = React.HTMLAttributes<HTMLDivElement>;

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => {
    const size = React.useContext(CardSizeContext);
    return (
      <div ref={ref} className={cx(cardContentStyles({ size }), className)} {...props} />
    );
  },
);
CardContent.displayName = "CardContent";

/* ========== CardFooter ========== */

export type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, ...props }, ref) => {
    const size = React.useContext(CardSizeContext);
    return (
      <div ref={ref} className={cx(cardFooterStyles({ size }), className)} {...props} />
    );
  },
);
CardFooter.displayName = "CardFooter";

/* ========== CardDivider ========== */

export type CardDividerProps = React.HTMLAttributes<HTMLHRElement>;

const CardDivider = React.forwardRef<HTMLHRElement, CardDividerProps>(
  ({ className, ...props }, ref) => (
    <hr ref={ref} className={cx(cardDividerStyles(), className)} {...props} />
  ),
);
CardDivider.displayName = "CardDivider";

export {
  Card,
  CardImage,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardDivider,
};
