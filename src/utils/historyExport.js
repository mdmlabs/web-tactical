/**
 * CSV / PDF exporter for the Agent History tab.
 *
 * Reuses the lazy-loaded jsPDF + jspdf-autotable pattern so the main bundle
 * stays small.
 */
import { exportFile, Notify } from "quasar";

const COLUMNS = ["Time", "Action", "Script/Command", "Initiated By", "Related Alerts"];

function toRow(h, relatedAlertsCount) {
  return {
    Time: h.time ? new Date(h.time).toLocaleString() : "—",
    Action: h.type || "—",
    "Script/Command":
      h.type === "script_run" ? h.script_name || "—" : h.command || "—",
    "Initiated By": h.username || "—",
    "Related Alerts": String(relatedAlertsCount ?? 0),
  };
}

function escapeCsvCell(val) {
  if (val === null || val === undefined) return '""';
  const s = String(val).split('"').join('""');
  return `"${s}"`;
}

function downloadCsv(rows, filename) {
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

async function loadPdfDeps() {
  const [jsPdfMod, autoTableMod] = await Promise.all([
    import("jspdf"),
    import("jspdf-autotable"),
  ]);
  return { jsPDF: jsPdfMod.jsPDF, autoTable: autoTableMod.default };
}

async function downloadPdf(rows, filename, agentHostname) {
  const { jsPDF, autoTable } = await loadPdfDeps();
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 40;

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Agent History Report", margin, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);

  const scriptRuns = rows.filter((r) => r.Action === "script_run").length;
  const cmdRuns = rows.filter((r) => r.Action === "cmd_run").length;
  const withAlerts = rows.filter((r) => Number(r["Related Alerts"]) > 0).length;

  const metaLines = [
    "Agent: " + (agentHostname || "—"),
    "Total entries: " + rows.length + "    Script runs: " + scriptRuns + "    Command runs: " + cmdRuns + "    With alerts: " + withAlerts,
    "Generated: " + new Date().toLocaleString(),
  ];
  metaLines.forEach((line, i) => {
    doc.text(line, margin, 62 + i * 13);
  });

  const cursorY = 62 + metaLines.length * 13 + 14;

  const body = rows.map((r) => COLUMNS.map((c) => String(r[c] ?? "")));
  autoTable(doc, {
    startY: cursorY,
    head: [COLUMNS],
    body,
    styles: { fontSize: 7, cellPadding: 3, overflow: "linebreak" },
    headStyles: { fillColor: [33, 150, 243], textColor: 255 },
    theme: "striped",
    margin: { left: margin, right: margin },
    didDrawPage: (data) => {
      const pageCount = doc.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text(
        "Page " + data.pageNumber + " of " + pageCount,
        pageWidth - margin,
        doc.internal.pageSize.getHeight() - 20,
        { align: "right" },
      );
    },
  });

  doc.save(filename);
}

export async function exportHistory(opts) {
  const rows = opts.history.map((h) => toRow(h, opts.relatedAlertsCounts?.[h.time] ?? 0));
  const filename = opts.filename + "." + opts.format;

  if (opts.format === "csv") {
    downloadCsv(rows, filename);
  } else {
    await downloadPdf(rows, filename, opts.agentHostname);
  }
  return rows.length;
}
