import { useState } from "react";
import { useTranslation } from "react-i18next";
import { fetchExportClient } from "~/services/tracking-client";
import {
  Button,
  Modal,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  Select,
  SelectItem,
  DatePickerRange,
  type DatePickerRangeValue,
} from "@ahiggs-ui/react";

interface ExportButtonsProps {
  trackingUrl: string;
  accessToken: string;
}

export function ExportButtons({ trackingUrl, accessToken }: ExportButtonsProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState("csv");
  const [dateRange, setDateRange] = useState<DatePickerRangeValue>(undefined);
  const [loading, setLoading] = useState(false);

  const handleClose = () => {
    setOpen(false);
    setFormat("csv");
    setDateRange(undefined);
  };

  const handleDownload = async () => {
    setLoading(true);
    try {
      let query = `format=${format}`;
      if (dateRange?.from) query += `&from=${dateRange.from.toISOString()}`;
      if (dateRange?.to) query += `&to=${dateRange.to.toISOString()}`;

      const res = await fetchExportClient(trackingUrl, accessToken, query);

      if (!res.ok) throw new Error("Export failed");

      const blob = await res.blob();

      // Extract filename from Content-Disposition header or use fallback
      const disposition = res.headers.get("Content-Disposition");
      const match = disposition?.match(/filename="?([^"]+)"?/);
      const filename = match?.[1] ?? `tracking-export-${new Date().toISOString().slice(0, 10)}.${format}`;

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 5000);

      handleClose();
    } catch (err) {
      console.error("Export download failed:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button variant="secondaryGray" size="sm" onClick={() => setOpen(true)}>
        {t("analytics.export.button")}
      </Button>

      <Modal open={open} onOpenChange={setOpen} size="sm" className="overflow-visible">
        <ModalHeader onClose={handleClose}>
          <ModalTitle>{t("analytics.export.title")}</ModalTitle>
          <ModalDescription>{t("analytics.export.description")}</ModalDescription>
        </ModalHeader>

        <ModalBody className="overflow-visible">
          <div className="space-y-4">
            <Select
              label={t("analytics.export.format")}
              value={format}
              onValueChange={setFormat}
            >
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="json">JSON</SelectItem>
            </Select>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-text-secondary">
                {t("analytics.export.dateRange")}
              </label>
              <DatePickerRange
                value={dateRange}
                onChange={setDateRange}
                maxDate={new Date()}
              />
            </div>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button type="button" variant="secondaryGray" onClick={handleClose}>
            {t("analytics.export.cancel")}
          </Button>
          <Button onClick={handleDownload} loading={loading} loadingText={t("analytics.export.download")}>
            {t("analytics.export.download")}
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
}
