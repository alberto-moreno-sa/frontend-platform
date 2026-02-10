import type { MetaFunction } from "react-router";
import { useTranslation } from "react-i18next";
import { InputGroup, InputPrefix, Input, Button } from "@ahiggs-ui/react";
import { ShowcaseSection } from "~/components/showcase/ShowcaseSection";

export const meta: MetaFunction = () => [{ title: "Input Group | Components" }];

export default function InputGroupShowcase() {
  const { t } = useTranslation();

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-semibold text-text-primary">{t("dashboard.nav.inputGroup")}</h1>

      <ShowcaseSection title="With Prefix">
        <InputGroup label="Website" prefix="https://">
          <Input placeholder="example.com" />
        </InputGroup>
      </ShowcaseSection>

      <ShowcaseSection title="With Label and Hint">
        <InputGroup label="Amount" hint="Enter the total amount">
          <Input placeholder="0.00" />
        </InputGroup>
      </ShowcaseSection>

      <ShowcaseSection title="With Leading Addon">
        <InputGroup label="Price" leadingAddon={<InputPrefix position="leading">$</InputPrefix>}>
          <Input placeholder="0.00" />
        </InputGroup>
      </ShowcaseSection>

      <ShowcaseSection title="With Trailing Addon">
        <InputGroup label="Search" trailingAddon={<Button size="sm">Go</Button>}>
          <Input placeholder="Search..." />
        </InputGroup>
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.sizes")}>
        <InputGroup label="Small" size="small" prefix="$">
          <Input placeholder="0.00" />
        </InputGroup>
        <InputGroup label="Medium" size="medium" prefix="$">
          <Input placeholder="0.00" />
        </InputGroup>
        <InputGroup label="Large" size="large" prefix="$">
          <Input placeholder="0.00" />
        </InputGroup>
      </ShowcaseSection>

      <ShowcaseSection title={t("showcase.states")}>
        <InputGroup label="Required" isRequired>
          <Input placeholder="Required field" />
        </InputGroup>
        <InputGroup label="Invalid" isInvalid hint="This field has an error">
          <Input placeholder="Invalid field" />
        </InputGroup>
        <InputGroup label="Disabled" disabled>
          <Input placeholder="Disabled field" />
        </InputGroup>
      </ShowcaseSection>
    </div>
  );
}
