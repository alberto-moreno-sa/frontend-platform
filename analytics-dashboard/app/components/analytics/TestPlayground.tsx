import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Button,
  Input,
  Badge,
  Modal,
  ModalHeader,
  ModalIcon,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
} from "@ui-kit/react";
import { ChartCard } from "./ChartCard";

interface TestPlaygroundProps {
  onTrack: (componentName: string, variant: string, action: string) => void;
}

export function TestPlayground({ onTrack }: TestPlaygroundProps) {
  const { t } = useTranslation();
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <ChartCard title={t("analytics.playground.title")} description={t("analytics.playground.description")}>
      <div className="space-y-6">
        {/* Buttons row */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Button</p>
          <div className="flex flex-wrap gap-2">
            <Button onClick={() => onTrack("Button", "primary", "click")}>
              {t("analytics.playground.clickMe")}
            </Button>
            <Button variant="secondaryGray" onClick={() => onTrack("Button", "secondaryGray", "click")}>
              Secondary
            </Button>
            <Button variant="secondaryColor" onClick={() => onTrack("Button", "secondaryColor", "click")}>
              Color
            </Button>
            <Button destructive onClick={() => onTrack("Button", "destructive", "click")}>
              Destructive
            </Button>
          </div>
        </div>

        {/* Input row */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Input</p>
          <div className="max-w-xs">
            <Input
              label=""
              placeholder={t("analytics.playground.typeHere")}
              onFocus={() => onTrack("Input", "default", "focus")}
              onBlur={() => onTrack("Input", "default", "blur")}
            />
          </div>
        </div>

        {/* Modal row */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Modal</p>
          <Button
            variant="secondaryGray"
            onClick={() => {
              onTrack("Modal", "default", "click");
              setModalOpen(true);
            }}
          >
            {t("showcase.openModal")}
          </Button>
          <Modal open={modalOpen} onOpenChange={setModalOpen} size="sm">
            <ModalHeader onClose={() => { onTrack("Modal", "close", "click"); setModalOpen(false); }}>
              <ModalIcon variant="brand">
                <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              </ModalIcon>
              <ModalTitle>{t("analytics.playground.modalTitle")}</ModalTitle>
              <ModalDescription>{t("analytics.playground.modalDesc")}</ModalDescription>
            </ModalHeader>
            <ModalBody>
              <p className="text-sm text-text-secondary">{t("analytics.playground.modalBody")}</p>
            </ModalBody>
            <ModalFooter>
              <Button variant="secondaryGray" onClick={() => { onTrack("Modal", "cancel", "click"); setModalOpen(false); }}>
                {t("analytics.playground.cancel")}
              </Button>
              <Button onClick={() => { onTrack("Modal", "confirm", "click"); setModalOpen(false); }}>
                {t("analytics.playground.confirm")}
              </Button>
            </ModalFooter>
          </Modal>
        </div>

        {/* Badge row */}
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-text-tertiary">Badge</p>
          <div className="flex flex-wrap gap-2">
            {(["default", "success", "warning", "destructive", "secondary", "outline"] as const).map((intent) => (
              <button key={intent} type="button" onClick={() => onTrack("Badge", intent, "click")}>
                <Badge intent={intent}>{t("analytics.playground.sampleBadge")}</Badge>
              </button>
            ))}
          </div>
        </div>
      </div>
    </ChartCard>
  );
}
