/**
 * CSV / XLSX / PDF exporter for the Agents page.
 *
 * Operates on the in-memory list of agents already loaded into the page —
 * there is no deep pagination here (unlike the Discover indexer exporter),
 * because Wazuh's agents API returns the full inventory in one round trip.
 *
 * jsPDF + xlsx are imported lazily so the agents bundle stays small for users
 * who never trigger an export.
 */
import { exportFile, Notify } from "quasar";
import type { WazuhAgent } from "@/types/wazuh";

export type AgentsExportFormat = "csv" | "xlsx" | "pdf";

export interface AgentsExportOptions {
  agents: WazuhAgent[];
  format: AgentsExportFormat;
  /** Filename without extension. */
  filename: string;
  /** Metadata shown in the PDF header (ignored for CSV/XLSX). */
  pdfMeta?: {
    title: string;
    filterText: string;
    totalAgents: number;
    exportedAgents: number;
  };
}

interface AgentRow {
  ID: string;
  Name: string;
  "IP address": string;
  "Group(s)": string;
  "Operating system": string;
  "Cluster node": string;
  Version: string;
  Status: string;
  "Last keepalive": string;
  "Date added": string;
}

const COLUMNS: (keyof AgentRow)[] = [
  "ID",
  "Name",
  "IP address",
  "Group(s)",
  "Operating system",
  "Cluster node",
  "Version",
  "Status",
  "Last keepalive",
  "Date added",
];

function toRow(a: WazuhAgent): AgentRow {
  const osLabel = a.os?.name
    ? `${a.os.name} ${a.os.version ?? ""}`.trim()
    : "Unknown";
  return {
    ID: a.id,
    Name: a.name,
    "IP address": a.ip,
    "Group(s)": (a.group ?? []).join("; "),
    "Operating system": osLabel,
    "Cluster node": a.node_name ?? "—",
    Version: (a.version ?? "").replace("Wazuh ", "") || "—",
    Status: a.status,
    "Last keepalive": a.lastKeepAlive
      ? new Date(a.lastKeepAlive).toLocaleString()
      : "—",
    "Date added": a.dateAdd ? new Date(a.dateAdd).toLocaleString() : "—",
  };
}

function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const s = String(val).split('"').join('""');
  return `"${s}"`;
}

function downloadCsv(rows: AgentRow[], filename: string): void {
  const header = COLUMNS.map((c) => escapeCsvCell(c)).join(",");
  const lines = rows.map((r) =>
    COLUMNS.map((c) => escapeCsvCell(r[c])).join(","),
  );
  const content = [header, ...lines].join("\r\n");
  const status = exportFile(filename, content, "text/csv");
  if (status !== true) {
    Notify.create({
      type: "negative",
      message: "Browser denied file download.",
      icon: "warning",
    });
  }
}

async function downloadXlsx(rows: AgentRow[], filename: string): Promise<void> {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(rows, {
    header: COLUMNS as string[],
  });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Agents");
  const buffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const status = exportFile(filename, blob, blob.type);
  if (status !== true) {
    Notify.create({
      type: "negative",
      message: "Browser denied file download.",
      icon: "warning",
    });
  }
}

async function loadPdfDeps(): Promise<{
  jsPDF: typeof import("jspdf").jsPDF;
  autoTable: typeof import("jspdf-autotable").default;
}> {
  const [jsPdfMod, autoTableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  return { jsPDF: jsPdfMod.jsPDF, autoTable: autoTableMod.default };
}

async function downloadPdf(
  rows: AgentRow[],
  filename: string,
  meta: NonNullable<AgentsExportOptions["pdfMeta"]>,
): Promise<void> {
  const { jsPDF, autoTable } = await loadPdfDeps();
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Agents Report", 40, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  const metaLines = [
    `Source: ${meta.title}`,
    `Filter: ${meta.filterText || "(none)"}`,
    `Total agents: ${meta.totalAgents.toLocaleString()}    Rows exported: ${meta.exportedAgents.toLocaleString()}`,
    `Generated: ${new Date().toLocaleString()}`,
  ];
  metaLines.forEach((line, i) => {
    doc.text(line, 40, 62 + i * 13);
  });

  const body = rows.map((r) => COLUMNS.map((c) => String(r[c] ?? "")));
  autoTable(doc, {
    startY: 62 + metaLines.length * 13 + 10,
    head: [COLUMNS as string[]],
    body,
    styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    theme: "striped",
    margin: { left: 40, right: 40 },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `Page ${data.pageNumber} of ${pageCount}`,
        pageWidth - 40,
        doc.internal.pageSize.getHeight() - 20,
        { align: "right" },
      );
    },
  });

  doc.save(filename);
}

export async function exportAgents(
  opts: AgentsExportOptions,
): Promise<number> {
  const rows = opts.agents.map(toRow);
  const filename = `${opts.filename}.${opts.format}`;

  if (opts.format === "csv") {
    downloadCsv(rows, filename);
  } else if (opts.format === "xlsx") {
    await downloadXlsx(rows, filename);
  } else {
    if (!opts.pdfMeta) {
      throw new Error("PDF export requires pdfMeta");
    }
    await downloadPdf(rows, filename, opts.pdfMeta);
  }
  return rows.length;
}

export const AGENTS_EXPORT_COLUMNS = COLUMNS;
