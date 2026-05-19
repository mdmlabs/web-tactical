/**
 * CSV / PDF exporter for the Windows Update (maintenance) history tab.
 *
 * Reuses the lazy-loaded jsPDF + jspdf-autotable pattern from agentsExport.ts
 * so the main bundle stays small.
 */
import { exportFile, Notify } from "quasar";

const COLUMNS = ["Action", "Installed", "Severity", "Name", "More Info", "Installed On"];

function actionLabel(action) {
  switch (action) {
    case "approve":
      return "Approve";
    case "ignore":
      return "Ignore";
    case "nothing":
      return "Do Nothing";
    case "inherit":
      return "Inherit";
    default:
      return action || "—";
  }
}

function installedLabel(installed, action) {
  if (installed) return "Installed";
  if (action === "approve") return "Pending";
  if (action === "ignore") return "Ignored";
  return "Missing";
}

function toRow(u) {
  return {
    Action: actionLabel(u.action),
    Installed: installedLabel(u.installed, u.action),
    Severity: !u.severity ? "Other" : u.severity,
    Name: u.title || "—",
    "More Info": u.description || "—",
    "Installed On": u.date_installed
      ? new Date(u.date_installed).toLocaleString()
      : "—",
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
  doc.text("Windows Maintenance Report", margin, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  const total = rows.length;
  const installed = rows.filter((r) => r.Installed === "Installed").length;
  const missing = rows.filter((r) => r.Installed === "Missing").length;
  const pending = rows.filter((r) => r.Installed === "Pending").length;
  const ignored = rows.filter((r) => r.Installed === "Ignored").length;

  const metaLines = [
    "Agent: " + (agentHostname || "—"),
    "Total updates: " + total + "    Installed: " + installed + "    Missing: " + missing + "    Pending: " + pending + "    Ignored: " + ignored,
    "Generated: " + new Date().toLocaleString(),
  ];
  metaLines.forEach((line, i) => {
    doc.text(line, margin, 62 + i * 13);
  });

  // Summary donut-style cards
  const cardY = 62 + metaLines.length * 13 + 14;
  const cardW = (pageWidth - margin * 2 - 24) / 4;
  const cardH = 42;

  const drawSummaryCard = (label, value, color, x) => {
    doc.setFillColor(color[0], color[1], color[2]);
    doc.roundedRect(x, cardY, cardW, cardH, 4, 4, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text(String(value), x + cardW / 2, cardY + 22, {
      align: "center",
    });
    doc.setFontSize(8);
    doc.text(label, x + cardW / 2, cardY + 35, { align: "center" });
  };

  drawSummaryCard("Installed", installed, [71, 198, 142], margin);
  drawSummaryCard("Missing", missing, [255, 100, 92], margin + cardW + 8);
  drawSummaryCard("Pending", pending, [33, 150, 243], margin + (cardW + 8) * 2);
  drawSummaryCard("Ignored", ignored, [164, 129, 212], margin + (cardW + 8) * 3);

  const cursorY = cardY + cardH + 14;

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

export async function exportWinUpdates(opts) {
  const rows = opts.updates.map(toRow);
  const filename = opts.filename + "." + opts.format;

  if (opts.format === "csv") {
    downloadCsv(rows, filename);
  } else {
    await downloadPdf(rows, filename, opts.agentHostname);
  }
  return rows.length;
}
