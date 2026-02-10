import type { MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import { Textarea } from "@ahiggs-ui/react";
import { ShowcaseSection } from "~/components/showcase/ShowcaseSection";

export const meta: MetaFunction = () => [{ title: "Textarea | Components" }];

export default function TextareaShowcase() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("dashboard.nav.textarea")}</h1>

      <ShowcaseSection title={t("showcase.variants")}>
        <Textarea label="Default" placeholder="Enter your message" />
        <Textarea label="Error" variant="error" placeholder="Enter your message" helperText="This field is required" />
        <Textarea label="Success" variant="success" placeholder="Enter your message" helperText="Message saved!" />
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.sizes")}>
        <Textarea label="Small" size="small" placeholder="Small textarea" />
        <Textarea label="Medium" size="medium" placeholder="Medium textarea" />
        <Textarea label="Large" size="large" placeholder="Large textarea" />
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.states")}>
        <Textarea label="Required" isRequired placeholder="Required field" />
        <Textarea label="Disabled" disabled placeholder="Disabled textarea" />
        <Textarea label="Filled" defaultValue="This is some pre-filled content that demonstrates how the textarea looks with text." />
      </ShowcaseSection>

      <ShowcaseSection title="With Tooltip">
        <Textarea label="Description" tooltip="Provide a brief description" placeholder="Describe your project..." />
      </ShowcaseSection>
    </div>
  );
}
