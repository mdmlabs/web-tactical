/**
 * CSV / XLSX / PDF exporter for the Agent Detail (endpoint) page.
 *
 * Operates on data already loaded into the page by `wazuhStore.fetchAgentDetail`
 * and `agentComplianceStore.fetchComplianceForAgent` — no extra round-trips.
 * The PDF mirrors the on-screen layout: agent header, system inventory, hourly
 * events chart, MITRE top tactics, compliance donut, vulnerability KPIs +
 * top packages, SCA latest scans and FIM recent events.
 *
 * jsPDF + jspdf-autotable + xlsx are imported lazily so the agents bundle
 * stays small for users who never trigger an export.
 */
import { exportFile, Notify } from "quasar";
import type {
  WazuhAgent,
  WazuhSCAPolicy,
  WazuhSyscheckEntry,
  WazuhSyscollectorHardware,
  WazuhSyscollectorOS,
  WazuhVulnerability,
} from "@/types/wazuh";
import {
  drawDonut,
  drawHorizontalBars,
  drawVerticalBars,
  DONUT_PALETTE,
  type ChartRegion,
} from "@/utils/pdfCharts";

export type AgentDetailExportFormat = "csv" | "xlsx" | "pdf";

export interface AgentDetailComplianceItem {
  requirement: string;
  count: number;
}

export interface AgentDetailExportData {
  agent: WazuhAgent;
  hardware: WazuhSyscollectorHardware | null;
  os: WazuhSyscollectorOS | null;
  hourlyEvents: number[];
  topTactics: { name: string; count: number }[];
  complianceFramework: string;
  complianceFrameworkLabel: string;
  complianceItems: AgentDetailComplianceItem[];
  vulnerabilities: WazuhVulnerability[];
  topVulnPackages: { name: string; count: number }[];
  scaPolicies: WazuhSCAPolicy[];
  fimEntries: (WazuhSyscheckEntry & {
    ruleDescription?: string;
    ruleId?: string | number;
    level?: number;
  })[];
}

export interface AgentDetailExportOptions {
  data: AgentDetailExportData;
  format: AgentDetailExportFormat;
  /** Filename without extension. */
  filename: string;
  /** Cap the FIM table — the on-screen view paginates, the export does not. */
  maxFimRows: number;
}

/* ============================================================== */
/* Row shapes                                                       */
/* ============================================================== */

interface OverviewRow {
  Section: string;
  Field: string;
  Value: string;
}

interface VulnRow {
  Severity: string;
  Count: number;
}

interface VulnPackageRow {
  Package: string;
  Count: number;
}

interface ComplianceRow {
  Requirement: string;
  Count: number;
}

interface TacticRow {
  Tactic: string;
  Count: number;
}

interface ScaRow {
  Policy: string;
  "End scan": string;
  Passed: number;
  Failed: number;
  "Not applicable": number;
  "Score (%)": number;
}

interface FimRow {
  Time: string;
  Path: string;
  Action: string;
  "Rule description": string;
  "Rule level": string;
  "Rule ID": string;
}

interface EventRow {
  Hour: string;
  Events: number;
}

/* ============================================================== */
/* Shared helpers                                                   */
/* ============================================================== */

function formatBytes(bytes: number | undefined): string {
  if (!bytes && bytes !== 0) return "—";
  if (bytes >= 1073741824) return `${(bytes / 1073741824).toFixed(1)} GB`;
  if (bytes >= 1048576) return `${(bytes / 1048576).toFixed(1)} MB`;
  if (bytes >= 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${bytes} B`;
}

function formatDateValue(v: string | undefined): string {
  if (!v) return "—";
  try {
    return new Date(v).toLocaleString();
  } catch {
    return v;
  }
}

function escapeCsvCell(val: unknown): string {
  if (val === null || val === undefined) return '""';
  const s = String(val).split('"').join('""');
  return `"${s}"`;
}

function csvSection<T>(
  title: string,
  rows: T[],
  columns: (keyof T & string)[],
): string {
  const lines: string[] = [];
  lines.push(`# ${title}`);
  if (rows.length === 0) {
    lines.push("(no data)");
    return lines.join("\r\n");
  }
  lines.push(columns.map((c) => escapeCsvCell(c)).join(","));
  for (const r of rows) {
    lines.push(columns.map((c) => escapeCsvCell(r[c])).join(","));
  }
  return lines.join("\r\n");
}

/* ============================================================== */
/* Row builders                                                     */
/* ============================================================== */

function buildOverviewRows(data: AgentDetailExportData): OverviewRow[] {
  const a = data.agent;
  const hw = data.hardware;
  return [
    { Section: "Agent", Field: "ID", Value: a.id ?? "—" },
    { Section: "Agent", Field: "Name", Value: a.name ?? "—" },
    { Section: "Agent", Field: "Status", Value: a.status ?? "—" },
    { Section: "Agent", Field: "IP address", Value: a.ip ?? "—" },
    { Section: "Agent", Field: "Version", Value: a.version ?? "—" },
    {
      Section: "Agent",
      Field: "Group",
      Value: (a.group ?? []).join(", ") || "—",
    },
    {
      Section: "Agent",
      Field: "Operating system",
      Value: `${a.os?.name ?? "—"} ${a.os?.version ?? ""}`.trim(),
    },
    { Section: "Agent", Field: "Cluster node", Value: a.node_name ?? "—" },
    {
      Section: "Agent",
      Field: "Registration date",
      Value: formatDateValue(a.dateAdd),
    },
    {
      Section: "Agent",
      Field: "Last keep alive",
      Value: formatDateValue(a.lastKeepAlive),
    },
    {
      Section: "System inventory",
      Field: "Cores",
      Value: hw?.cpu?.cores != null ? String(hw.cpu.cores) : "—",
    },
    {
      Section: "System inventory",
      Field: "Memory",
      Value: formatBytes(hw?.ram?.total),
    },
    { Section: "System inventory", Field: "CPU", Value: hw?.cpu?.name ?? "—" },
    {
      Section: "System inventory",
      Field: "Host name",
      Value: data.os?.hostname ?? "—",
    },
    {
      Section: "System inventory",
      Field: "Serial number",
      Value: hw?.board_serial ?? "—",
    },
  ];
}

function buildVulnSeverityRows(data: AgentDetailExportData): VulnRow[] {
  const count = (sev: string) =>
    data.vulnerabilities.filter(
      (v) => (v.severity || "").toLowerCase() === sev,
    ).length;
  return [
    { Severity: "Critical", Count: count("critical") },
    { Severity: "High", Count: count("high") },
    { Severity: "Medium", Count: count("medium") },
    { Severity: "Low", Count: count("low") },
  ];
}

function buildScaRows(data: AgentDetailExportData): ScaRow[] {
  return data.scaPolicies.map((p) => ({
    Policy: p.name,
    "End scan": p.end_scan,
    Passed: p.pass,
    Failed: p.fail,
    "Not applicable": p.invalid,
    "Score (%)": p.score,
  }));
}

function buildFimRows(
  data: AgentDetailExportData,
  cap: number,
): FimRow[] {
  return data.fimEntries.slice(0, cap).map((e) => ({
    Time: e.date ?? "",
    Path: e.file ?? "",
    Action: e.type ?? "",
    "Rule description": e.ruleDescription ?? "",
    "Rule level": e.level != null ? String(e.level) : "",
    "Rule ID": e.ruleId != null ? String(e.ruleId) : "",
  }));
}

function buildEventRows(data: AgentDetailExportData): EventRow[] {
  const arr = data.hourlyEvents.length
    ? data.hourlyEvents
    : new Array(24).fill(0);
  return arr.slice(0, 24).map((v, i) => ({
    Hour: `${String(i).padStart(2, "0")}:00`,
    Events: v ?? 0,
  }));
}

/* ============================================================== */
/* CSV                                                              */
/* ============================================================== */

function downloadCsv(data: AgentDetailExportData, filename: string): void {
  const blocks: string[] = [];
  blocks.push(
    csvSection("Overview", buildOverviewRows(data), [
      "Section",
      "Field",
      "Value",
    ]),
  );
  blocks.push(
    csvSection("Events count evolution (last 24h)", buildEventRows(data), [
      "Hour",
      "Events",
    ]),
  );
  blocks.push(
    csvSection(
      "MITRE ATT&CK — Top Tactics",
      data.topTactics.map<TacticRow>((t) => ({
        Tactic: t.name,
        Count: t.count,
      })),
      ["Tactic", "Count"],
    ),
  );
  blocks.push(
    csvSection(
      `Compliance — ${data.complianceFrameworkLabel}`,
      data.complianceItems.map<ComplianceRow>((c) => ({
        Requirement: c.requirement,
        Count: c.count,
      })),
      ["Requirement", "Count"],
    ),
  );
  blocks.push(
    csvSection(
      "Vulnerability Detection — Severity",
      buildVulnSeverityRows(data),
      ["Severity", "Count"],
    ),
  );
  blocks.push(
    csvSection(
      "Vulnerability Detection — Top 5 packages",
      data.topVulnPackages.map<VulnPackageRow>((p) => ({
        Package: p.name,
        Count: p.count,
      })),
      ["Package", "Count"],
    ),
  );
  blocks.push(
    csvSection("SCA: Latest scans", buildScaRows(data), [
      "Policy",
      "End scan",
      "Passed",
      "Failed",
      "Not applicable",
      "Score (%)",
    ]),
  );
  blocks.push(
    csvSection("FIM: Recent events", buildFimRows(data, 1000), [
      "Time",
      "Path",
      "Action",
      "Rule description",
      "Rule level",
      "Rule ID",
    ]),
  );

  const content = blocks.join("\r\n\r\n");
  const status = exportFile(filename, content, "text/csv");
  if (status !== true) {
    Notify.create({
      type: "negative",
      message: "Browser denied file download.",
      icon: "warning",
    });
  }
}

/* ============================================================== */
/* XLSX                                                             */
/* ============================================================== */

async function downloadXlsx(
  data: AgentDetailExportData,
  filename: string,
): Promise<void> {
  const XLSX = await import("xlsx");
  const workbook = XLSX.utils.book_new();

  const addSheet = <T>(name: string, rows: T[], header: string[]) => {
    const sheet = XLSX.utils.json_to_sheet(rows.length ? rows : [{}], {
      header,
    });
    XLSX.utils.book_append_sheet(workbook, sheet, name.slice(0, 31));
  };

  addSheet("Overview", buildOverviewRows(data), ["Section", "Field", "Value"]);
  addSheet("Events 24h", buildEventRows(data), ["Hour", "Events"]);
  addSheet(
    "MITRE Tactics",
    data.topTactics.map<TacticRow>((t) => ({
      Tactic: t.name,
      Count: t.count,
    })),
    ["Tactic", "Count"],
  );
  addSheet(
    `Compliance ${data.complianceFrameworkLabel}`,
    data.complianceItems.map<ComplianceRow>((c) => ({
      Requirement: c.requirement,
      Count: c.count,
    })),
    ["Requirement", "Count"],
  );
  addSheet("Vulns Severity", buildVulnSeverityRows(data), [
    "Severity",
    "Count",
  ]);
  addSheet(
    "Top Vuln Packages",
    data.topVulnPackages.map<VulnPackageRow>((p) => ({
      Package: p.name,
      Count: p.count,
    })),
    ["Package", "Count"],
  );
  addSheet("SCA Latest scans", buildScaRows(data), [
    "Policy",
    "End scan",
    "Passed",
    "Failed",
    "Not applicable",
    "Score (%)",
  ]);
  addSheet("FIM Recent events", buildFimRows(data, 5000), [
    "Time",
    "Path",
    "Action",
    "Rule description",
    "Rule level",
    "Rule ID",
  ]);

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

/* ============================================================== */
/* PDF                                                              */
/* ============================================================== */

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

const SEVERITY_COLORS: Record<string, [number, number, number]> = {
  Critical: [220, 38, 38],
  High: [234, 88, 12],
  Medium: [202, 138, 4],
  Low: [37, 99, 235],
};

async function downloadPdf(
  data: AgentDetailExportData,
  filename: string,
): Promise<void> {
  const { jsPDF, autoTable } = await loadPdfDeps();
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: "a4",
  });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 36;
  const contentWidth = pageWidth - margin * 2;

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(`Agent Report — ${data.agent.name} (${data.agent.id})`, margin, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  const headerLines = [
    `Status: ${data.agent.status}    IP: ${data.agent.ip}    Version: ${
      data.agent.version ?? "—"
    }    Group: ${(data.agent.group ?? []).join(", ") || "—"}`,
    `Operating system: ${data.agent.os?.name ?? "—"} ${
      data.agent.os?.version ?? ""
    }    Cluster node: ${data.agent.node_name ?? "—"}`,
    `Last keepalive: ${formatDateValue(
      data.agent.lastKeepAlive,
    )}    Generated: ${new Date().toLocaleString()}`,
  ];
  headerLines.forEach((l, i) => doc.text(l, margin, 60 + i * 13));

  // System inventory strip
  let cursorY = 60 + headerLines.length * 13 + 14;
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.text("System inventory", margin, cursorY);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(60);
  const hw = data.hardware;
  const inv = [
    `Cores: ${hw?.cpu?.cores ?? "—"}`,
    `Memory: ${formatBytes(hw?.ram?.total)}`,
    `CPU: ${hw?.cpu?.name ?? "—"}`,
    `Host: ${data.os?.hostname ?? "—"}`,
    `Serial: ${hw?.board_serial ?? "—"}`,
  ];
  doc.text(inv.join("    "), margin, cursorY + 14);
  cursorY += 28;

  // 3-column row: Events chart | MITRE bars | Compliance donut
  const cardGap = 12;
  const cardW = (contentWidth - cardGap * 2) / 3;
  const cardH = 150;

  const drawCard = (title: string, x: number, draw: (r: ChartRegion) => void) => {
    doc.setDrawColor(220);
    doc.setLineWidth(0.5);
    doc.roundedRect(x, cursorY, cardW, cardH, 4, 4, "S");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(30);
    doc.text(title, x + 8, cursorY + 16);
    draw({
      x: x + 8,
      y: cursorY + 24,
      width: cardW - 16,
      height: cardH - 32,
    });
  };

  drawCard("Events count evolution", margin, (r) =>
    drawVerticalBars(doc, data.hourlyEvents.slice(0, 24), r),
  );
  drawCard("MITRE ATT&CK · Top Tactics", margin + cardW + cardGap, (r) =>
    drawHorizontalBars(
      doc,
      data.topTactics.slice(0, 5).map((t) => ({
        label: t.name,
        value: t.count,
      })),
      r,
    ),
  );
  drawCard(
    `Compliance · ${data.complianceFrameworkLabel}`,
    margin + (cardW + cardGap) * 2,
    (r) =>
      drawDonut(
        doc,
        data.complianceItems.slice(0, 7).map((c, i) => ({
          label: c.requirement,
          value: c.count,
          color: DONUT_PALETTE[i % DONUT_PALETTE.length],
        })),
        r,
      ),
  );
  cursorY += cardH + 16;

  // Vulnerability Detection — KPI bars + top packages table
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.text("Vulnerability Detection", margin, cursorY);
  cursorY += 8;

  const vulnRows = buildVulnSeverityRows(data);
  const vulnHalfW = (contentWidth - cardGap) / 2;
  const vulnRegion: ChartRegion = {
    x: margin,
    y: cursorY,
    width: vulnHalfW,
    height: 80,
  };
  drawHorizontalBars(
    doc,
    vulnRows.map((r) => ({
      label: r.Severity,
      value: r.Count,
      color: SEVERITY_COLORS[r.Severity],
    })),
    vulnRegion,
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.setTextColor(40);
  doc.text("Top 5 Packages", margin + vulnHalfW + cardGap, cursorY + 10);
  autoTable(doc, {
    startY: cursorY + 14,
    margin: { left: margin + vulnHalfW + cardGap, right: margin },
    head: [["Package", "Count"]],
    body: data.topVulnPackages.length
      ? data.topVulnPackages.map((p) => [p.name, String(p.count)])
      : [["(no data)", ""]],
    styles: { fontSize: 8, cellPadding: 3 },
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    theme: "striped",
    tableWidth: vulnHalfW,
  });
  cursorY += 100;

  // SCA: Latest scans
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(30);
  doc.text("SCA: Latest scans", margin, cursorY);
  const scaBody = data.scaPolicies.length
    ? data.scaPolicies.map((p) => [
        p.name,
        p.end_scan,
        String(p.pass),
        String(p.fail),
        String(p.invalid),
        `${p.score}%`,
      ])
    : [["(no data)", "", "", "", "", ""]];
  autoTable(doc, {
    startY: cursorY + 6,
    margin: { left: margin, right: margin },
    head: [["Policy", "End scan", "Passed", "Failed", "N/A", "Score"]],
    body: scaBody,
    styles: { fontSize: 8, cellPadding: 4, overflow: "linebreak" },
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    theme: "striped",
  });

  // FIM Recent events — let autoTable break across pages.
  autoTable(doc, {
    startY: (doc as unknown as { lastAutoTable?: { finalY: number } })
      .lastAutoTable?.finalY
      ? (doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable
          .finalY + 20
      : cursorY + 60,
    margin: { left: margin, right: margin },
    head: [["Time", "Path", "Action", "Rule description", "Level", "Rule ID"]],
    body: buildFimRows(data, 200).map((r) => [
      r.Time,
      r.Path,
      r.Action,
      r["Rule description"],
      r["Rule level"],
      r["Rule ID"],
    ]),
    styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 280 },
      2: { cellWidth: 60 },
      3: { cellWidth: 180 },
      4: { cellWidth: 36 },
      5: { cellWidth: 50 },
    },
    theme: "striped",
    didDrawPage: (data2) => {
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        `FIM: Recent events — page ${data2.pageNumber} of ${doc.getNumberOfPages()}`,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 18,
        { align: "right" },
      );
    },
  });

  doc.save(filename);
}

/* ============================================================== */
/* Public entry point                                               */
/* ============================================================== */

export async function exportAgentDetail(
  opts: AgentDetailExportOptions,
): Promise<number> {
  const filename = `${opts.filename}.${opts.format}`;
  const data = opts.data;
  // Pre-cap FIM for the on-screen exports; PDF caps internally.
  const fimCount = Math.min(opts.maxFimRows, data.fimEntries.length);

  if (opts.format === "csv") {
    downloadCsv(
      { ...data, fimEntries: data.fimEntries.slice(0, opts.maxFimRows) },
      filename,
    );
  } else if (opts.format === "xlsx") {
    await downloadXlsx(
      { ...data, fimEntries: data.fimEntries.slice(0, opts.maxFimRows) },
      filename,
    );
  } else {
    await downloadPdf(data, filename);
  }
  return fimCount;
}
