import * as React from "react";
import type { VariantProps } from "class-variance-authority";
import { cx } from "@ui-kit/utils";
import { badgeStyles } from "./Badge.styles";

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeStyles> {}

const Badge = React.forwardRef<HTMLSpanElement, BadgeProps>(
  ({ className, intent, size, ...props }, ref) => (
    <span ref={ref} className={cx(badgeStyles({ intent, size }), className)} {...props} />
  ),
);

Badge.displayName = "Badge";

export { Badge };
