/**
 * CSV / XLSX / PDF exporter for the Discover view.
 *
 * Deep-paginates past OpenSearch's `index.max_result_window` (default 10 000)
 * using `search_after`, which is the recommended approach in the Wazuh Indexer
 * API docs for large exports. Only the columns currently selected in the
 * Discover sidebar are emitted — not the full `_source`.
 *
 * PDF reports embed a "Count per timestamp" histogram (drawn with jsPDF
 * primitives — no DOM, no screenshot pipeline) plus the query metadata and a
 * table of the first N hits.
 */
import { exportFile, Notify } from "quasar";
import * as XLSX from "xlsx";
import type { jsPDF as JsPDFInstance } from "jspdf";
import { wazuhIndexerApi } from "@/api/wazuhIndexer";
import type { OpenSearchQueryBody } from "@/types/fim";

/**
 * jsPDF + jspdf-autotable weigh ~600 KB combined and most users never export
 * PDF. Loading them lazily keeps them out of the main bundle, which also
 * reduces peak memory during `vite build` (the deploy box has been hitting
 * the Node 2 GB heap limit while bundling everything together).
 */
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

export type ExportFormat = "csv" | "xlsx" | "pdf";

export interface ExportProgress {
  fetched: number;
  total: number;
}

export interface ExportOptions {
  /** Backend index pattern (already mapped, e.g. `wazuh-alerts-*`). */
  indexPattern: string;
  /** Base query — usually the same bool/must used by the Discover table. */
  query: Record<string, unknown>;
  /** Dotted field paths to include as columns. */
  fields: string[];
  /** Hard cap on rows; also used to decide when to stop paginating. */
  maxRows: number;
  /** Page size per _search request (≤ 10 000). */
  pageSize?: number;
  /** Output format. */
  format: ExportFormat;
  /** Download filename (no extension; it's appended). */
  filename: string;
  /** Progress callback invoked after each page. */
  onProgress?: (p: ExportProgress) => void;
  /** Abort signal — checked between pages. */
  signal?: AbortSignal;
  /** Metadata shown in the PDF header (ignored for CSV/XLSX). */
  pdfMeta?: {
    title: string;
    queryString: string;
    timeRange: string;
    indexPattern: string;
  };
  /** Histogram interval for the PDF chart (e.g. `30m`, `1h`). */
  histogramInterval?: string;
  /** @timestamp range for the histogram chart's `extended_bounds`. */
  histogramBounds?: { gte: string; lte: string };
}

interface IndexerHit {
  _id: string;
  _index: string;
  _source: Record<string, unknown>;
  sort?: unknown[];
}

interface HistogramBucket {
  key_as_string: string;
  key: number;
  doc_count: number;
}

/** Resolve a dotted field path from a nested _source object. */
function getNestedValue(
  obj: Record<string, unknown>,
  path: string,
): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current === null || current === undefined || typeof current !== "object") {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

function formatCell(val: unknown): string {
  if (val === null || val === undefined) return "";
  if (Array.isArray(val)) return val.map((v) => formatCell(v)).join("; ");
  if (typeof val === "object") return JSON.stringify(val);
  return String(val);
}

function escapeCsvCell(val: unknown): string {
  const s = formatCell(val).split('"').join('""');
  return `"${s}"`;
}

/** Fetch just the histogram aggregation — used for the PDF chart. */
async function fetchHistogram(opts: ExportOptions): Promise<HistogramBucket[]> {
  if (!opts.histogramInterval || !opts.histogramBounds) return [];
  const body: OpenSearchQueryBody = {
    query: opts.query,
    size: 0,
    aggs: {
      events_over_time: {
        date_histogram: {
          field: "@timestamp",
          fixed_interval: opts.histogramInterval,
          min_doc_count: 0,
          extended_bounds: {
            min: opts.histogramBounds.gte,
            max: opts.histogramBounds.lte,
          },
        },
      },
    },
  };
  const resp = await wazuhIndexerApi.search<IndexerHit>(opts.indexPattern, body);
  const aggs = resp.aggregations as
    | { events_over_time?: { buckets?: HistogramBucket[] } }
    | undefined;
  return aggs?.events_over_time?.buckets ?? [];
}

/**
 * Fetches every matching document up to `maxRows` using `search_after`.
 */
async function fetchAllHits(opts: ExportOptions): Promise<IndexerHit[]> {
  const pageSize = Math.min(opts.pageSize ?? 5000, 10000);
  const sort: Record<string, unknown>[] = [
    { "@timestamp": { order: "desc" } },
    { _id: { order: "desc" } },
  ];

  const out: IndexerHit[] = [];
  let searchAfter: unknown[] | undefined;

  while (out.length < opts.maxRows) {
    if (opts.signal?.aborted) throw new DOMException("Aborted", "AbortError");

    const remaining = opts.maxRows - out.length;
    const requestedSize = Math.min(pageSize, remaining);
    const body: OpenSearchQueryBody = {
      query: opts.query,
      size: requestedSize,
      sort,
      _source: opts.fields.length ? opts.fields : true,
      track_total_hits: true,
    };
    if (searchAfter) body.search_after = searchAfter;

    const resp = await wazuhIndexerApi.search<IndexerHit>(
      opts.indexPattern,
      body,
    );
    const hits = resp.hits.hits as unknown as IndexerHit[];
    if (hits.length === 0) break;

    out.push(...hits);
    opts.onProgress?.({
      fetched: out.length,
      total: resp.hits.total.value,
    });

    const last = hits[hits.length - 1];
    if (!last.sort || hits.length < requestedSize) break;
    searchAfter = last.sort;
  }

  return out;
}

function downloadCsv(
  hits: IndexerHit[],
  fields: string[],
  filename: string,
): void {
  const header = fields.map((f) => escapeCsvCell(f)).join(",");
  const lines = hits.map((h) =>
    fields.map((f) => escapeCsvCell(getNestedValue(h._source, f))).join(","),
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

function downloadXlsx(
  hits: IndexerHit[],
  fields: string[],
  filename: string,
): void {
  const data = hits.map((h) => {
    const row: Record<string, unknown> = {};
    for (const f of fields) row[f] = formatCell(getNestedValue(h._source, f));
    return row;
  });
  const worksheet = XLSX.utils.json_to_sheet(data, { header: fields });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Discover");
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

/** Short timestamp label for the chart X axis. */
function shortTime(iso: string, windowMs: number): string {
  const d = new Date(iso);
  if (windowMs <= 60 * 60 * 1000) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  if (windowMs <= 24 * 60 * 60 * 1000) {
    return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
  }
  return `${d.getMonth() + 1}/${d.getDate()}`;
}

/** Draw a simple bar chart into the PDF at the given region. */
function drawHistogramChart(
  doc: JsPDFInstance,
  buckets: HistogramBucket[],
  region: { x: number; y: number; width: number; height: number },
): void {
  if (buckets.length === 0) {
    doc.setFontSize(10);
    doc.setTextColor(120);
    doc.text("(no data for histogram)", region.x, region.y + region.height / 2);
    return;
  }

  const maxCount = Math.max(1, ...buckets.map((b) => b.doc_count));
  const paddingLeft = 28;
  const paddingBottom = 14;
  const chartX = region.x + paddingLeft;
  const chartY = region.y;
  const chartW = region.width - paddingLeft;
  const chartH = region.height - paddingBottom;

  // Axes
  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  doc.line(chartX, chartY, chartX, chartY + chartH); // Y axis
  doc.line(chartX, chartY + chartH, chartX + chartW, chartY + chartH); // X axis

  // Y axis ticks (0, mid, max)
  doc.setFontSize(7);
  doc.setTextColor(90);
  const ticks = [0, Math.round(maxCount / 2), maxCount];
  ticks.forEach((t) => {
    const y = chartY + chartH - (t / maxCount) * chartH;
    doc.text(String(t), chartX - 2, y + 2, { align: "right" });
    doc.setDrawColor(230);
    doc.line(chartX, y, chartX + chartW, y);
    doc.setDrawColor(180);
  });

  // Bars
  const barWidth = Math.max(0.5, chartW / buckets.length - 0.5);
  doc.setFillColor(33, 150, 243); // blue
  buckets.forEach((b, i) => {
    const h = maxCount > 0 ? (b.doc_count / maxCount) * chartH : 0;
    const x = chartX + (i * chartW) / buckets.length + 0.25;
    const y = chartY + chartH - h;
    if (h > 0) doc.rect(x, y, barWidth, h, "F");
  });

  // X axis labels — sparse
  const labelsToShow = Math.min(6, buckets.length);
  const step = Math.max(1, Math.floor(buckets.length / labelsToShow));
  const windowMs =
    buckets.length > 1
      ? new Date(buckets[buckets.length - 1].key_as_string).getTime() -
        new Date(buckets[0].key_as_string).getTime()
      : 0;
  doc.setFontSize(7);
  for (let i = 0; i < buckets.length; i += step) {
    const x = chartX + (i * chartW) / buckets.length;
    const label = shortTime(buckets[i].key_as_string, windowMs);
    doc.text(label, x, chartY + chartH + 6);
  }
}

async function downloadPdf(
  hits: IndexerHit[],
  buckets: HistogramBucket[],
  fields: string[],
  totalHits: number,
  filename: string,
  meta: NonNullable<ExportOptions["pdfMeta"]>,
): Promise<void> {
  const { jsPDF, autoTable } = await loadPdfDeps();
  const doc = new jsPDF({ orientation: "landscape", unit: "pt", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();

  // Header
  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text("Discover Report", 40, 40);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(80);
  const metaLines = [
    `Source: ${meta.title}`,
    `Index: ${meta.indexPattern}`,
    `Time range: ${meta.timeRange}`,
    `Query: ${meta.queryString || "(none)"}`,
    `Total hits: ${totalHits.toLocaleString()}    Rows exported: ${hits.length.toLocaleString()}`,
    `Generated: ${new Date().toLocaleString()}`,
  ];
  metaLines.forEach((line, i) => {
    doc.text(line, 40, 62 + i * 13);
  });

  // Histogram chart
  const chartTop = 62 + metaLines.length * 13 + 10;
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(40);
  doc.text("Count per timestamp", 40, chartTop);
  drawHistogramChart(doc, buckets, {
    x: 40,
    y: chartTop + 8,
    width: pageWidth - 80,
    height: 130,
  });

  // Data table
  const body = hits.map((h) =>
    fields.map((f) => formatCell(getNestedValue(h._source, f))),
  );
  autoTable(doc, {
    startY: chartTop + 160,
    head: [fields],
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

export async function exportDiscover(opts: ExportOptions): Promise<number> {
  // Run histogram + hit fetch in parallel for PDF so the total latency stays
  // close to the single-request baseline.
  const [buckets, hits] = await Promise.all([
    opts.format === "pdf" ? fetchHistogram(opts) : Promise.resolve([]),
    fetchAllHits(opts),
  ]);

  const ext = opts.format;
  const filename = `${opts.filename}.${ext}`;

  if (opts.format === "xlsx") {
    downloadXlsx(hits, opts.fields, filename);
  } else if (opts.format === "pdf") {
    if (!opts.pdfMeta) {
      throw new Error("PDF export requires pdfMeta");
    }
    // We don't know `totalHits` directly — take it from the last progress tick
    // where search_after exposed `hits.total.value`. Fallback to hits.length.
    let total = hits.length;
    opts.onProgress?.({
      fetched: hits.length,
      total,
    });
    // Re-fetch just the total if we paginated (progress callback tracks it).
    // Simpler: use the response carried via a one-shot count query.
    try {
      const countResp = await wazuhIndexerApi.search<IndexerHit>(
        opts.indexPattern,
        { query: opts.query, size: 0, track_total_hits: true },
      );
      total = countResp.hits.total.value;
    } catch {
      // Ignore — we already have a reasonable estimate.
    }
    await downloadPdf(hits, buckets, opts.fields, total, filename, opts.pdfMeta);
  } else {
    downloadCsv(hits, opts.fields, filename);
  }
  return hits.length;
}
