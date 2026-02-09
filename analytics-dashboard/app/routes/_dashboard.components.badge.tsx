import type { MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import { Badge } from "@ui-kit/react";
import { ShowcaseSection } from "~/components/showcase/ShowcaseSection";

export const meta: MetaFunction = () => [{ title: "Badge | Components" }];

export default function BadgeShowcase() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("dashboard.nav.badge")}</h1>

      <ShowcaseSection title={t("showcase.variants")}>
        <Badge>Default</Badge>
        <Badge intent="secondary">Secondary</Badge>
        <Badge intent="destructive">Destructive</Badge>
        <Badge intent="outline">Outline</Badge>
        <Badge intent="success">Success</Badge>
        <Badge intent="warning">Warning</Badge>
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.sizes")}>
        <Badge size="small">Small</Badge>
        <Badge size="medium">Medium</Badge>
        <Badge size="large">Large</Badge>
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.examples")}>
        <div className="flex items-center gap-2">
          <Badge intent="success" size="small">Active</Badge>
          <span className="text-sm text-text-secondary">User is online</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge intent="warning" size="small">Pending</Badge>
          <span className="text-sm text-text-secondary">Awaiting approval</span>
        </div>
        <div className="flex items-center gap-2">
          <Badge intent="destructive" size="small">Error</Badge>
          <span className="text-sm text-text-secondary">Action required</span>
        </div>
      </ShowcaseSection>
    </div>
  );
}
