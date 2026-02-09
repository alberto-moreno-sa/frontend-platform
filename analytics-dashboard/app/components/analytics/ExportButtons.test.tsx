import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ExportButtons } from "./ExportButtons";

const defaultProps = {
  trackingUrl: "http://localhost:3002",
  accessToken: "test-token",
};

function renderExportButtons(props = {}) {
  return render(<ExportButtons {...defaultProps} {...props} />);
}

beforeEach(() => {
  jest.restoreAllMocks();
  globalThis.fetch = jest.fn();
  globalThis.URL.createObjectURL = jest.fn(() => "blob:mock");
  globalThis.URL.revokeObjectURL = jest.fn();
});

describe("ExportButtons", () => {
  it("renders a single Export button", () => {
    renderExportButtons();
    expect(screen.getByText("Export")).toBeInTheDocument();
  });

  it("opens modal when Export button is clicked", async () => {
    const user = userEvent.setup();
    renderExportButtons();

    await user.click(screen.getByText("Export"));
    expect(screen.getByText("Export Data")).toBeInTheDocument();
    expect(screen.getByText("Choose format and date range for your export.")).toBeInTheDocument();
  });

  it("modal shows format Select with CSV selected by default", async () => {
    const user = userEvent.setup();
    renderExportButtons();

    await user.click(screen.getByText("Export"));
    expect(screen.getByText("Format")).toBeInTheDocument();
    expect(screen.getByRole("combobox")).toHaveTextContent("CSV");
  });

  it("modal shows Date Range label", async () => {
    const user = userEvent.setup();
    renderExportButtons();

    await user.click(screen.getByText("Export"));
    expect(screen.getByText("Date Range")).toBeInTheDocument();
  });

  it("modal shows Cancel and Download buttons", async () => {
    const user = userEvent.setup();
    renderExportButtons();

    await user.click(screen.getByText("Export"));
    expect(screen.getByText("Cancel")).toBeInTheDocument();
    expect(screen.getByText("Download")).toBeInTheDocument();
  });

  it("closes modal when Cancel is clicked", async () => {
    const user = userEvent.setup();
    renderExportButtons();

    await user.click(screen.getByText("Export"));
    expect(screen.getByText("Export Data")).toBeInTheDocument();

    await user.click(screen.getByText("Cancel"));
    expect(screen.queryByText("Export Data")).not.toBeInTheDocument();
  });

  it("can switch format to JSON via Select", async () => {
    const user = userEvent.setup();
    renderExportButtons();

    await user.click(screen.getByText("Export"));
    await user.click(screen.getByRole("combobox"));
    await user.click(screen.getByRole("option", { name: "JSON" }));

    expect(screen.getByRole("combobox")).toHaveTextContent("JSON");
  });

  it("calls tracking-service export endpoint on Download click", async () => {
    const user = userEvent.setup();
    const headers = new Headers({
      "Content-Type": "text/csv",
      "Content-Disposition": 'attachment; filename="tracking-export-2026-02-09.csv"',
    });
    const mockFetch = (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers,
      blob: () => Promise.resolve(new Blob(["col1,col2\nval1,val2"])),
    });

    renderExportButtons();
    await user.click(screen.getByText("Export"));
    await user.click(screen.getByText("Download"));

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        "http://localhost:3002/api/components/export?format=csv",
        { headers: { Authorization: "Bearer test-token" } },
      );
    });
  });

  it("closes modal after successful download", async () => {
    const user = userEvent.setup();
    (globalThis.fetch as jest.Mock).mockResolvedValue({
      ok: true,
      headers: new Headers({ "Content-Type": "text/csv" }),
      blob: () => Promise.resolve(new Blob(["col1,col2\nval1,val2"])),
    });

    renderExportButtons();
    await user.click(screen.getByText("Export"));
    await user.click(screen.getByText("Download"));

    await waitFor(() => {
      expect(screen.queryByText("Export Data")).not.toBeInTheDocument();
    });
  });
});
