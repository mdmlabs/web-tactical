/**
 * Shared chart primitives for jsPDF reports — donuts and horizontal bars.
 * Used by both the Agents page PDF and the Agent Detail PDF so the charts
 * look identical across reports.
 */
import type { jsPDF as JsPDFInstance } from "jspdf";

export interface ChartRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DonutSegment {
  label: string;
  value: number;
  color: [number, number, number];
}

export interface BarRow {
  label: string;
  value: number;
  color?: [number, number, number];
}

export const DONUT_PALETTE: [number, number, number][] = [
  [0, 169, 229],
  [71, 198, 142],
  [253, 188, 64],
  [255, 100, 92],
  [164, 129, 212],
  [20, 184, 166],
  [236, 72, 153],
];

/**
 * Draws an annular donut chart with a center "Total" label and a vertical
 * legend to the right. The legend reserves the left half of the region (≈ the
 * donut's bounding box); legend entries flow into the remaining width.
 */
export function drawDonut(
  doc: JsPDFInstance,
  segments: DonutSegment[],
  region: ChartRegion,
  centerLabel?: string,
): void {
  const cx = region.x + region.height / 2;
  const cy = region.y + region.height / 2;
  const outer = region.height / 2 - 6;
  const inner = outer * 0.62;
  const total = segments.reduce((s, seg) => s + seg.value, 0);

  if (total === 0) {
    doc.setDrawColor(220);
    doc.setLineWidth(outer - inner);
    doc.circle(cx, cy, (outer + inner) / 2, "S");
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("(no data)", cx, cy, { align: "center", baseline: "middle" });
  } else {
    let startAngle = -Math.PI / 2;
    const steps = 64;
    for (const seg of segments) {
      if (seg.value <= 0) continue;
      const sweep = (seg.value / total) * Math.PI * 2;
      const endAngle = startAngle + sweep;
      doc.setFillColor(seg.color[0], seg.color[1], seg.color[2]);
      const segSteps = Math.max(2, Math.ceil((sweep / (Math.PI * 2)) * steps));
      for (let i = 0; i < segSteps; i++) {
        const a0 = startAngle + (sweep * i) / segSteps;
        const a1 = startAngle + (sweep * (i + 1)) / segSteps;
        const x0o = cx + Math.cos(a0) * outer;
        const y0o = cy + Math.sin(a0) * outer;
        const x1o = cx + Math.cos(a1) * outer;
        const y1o = cy + Math.sin(a1) * outer;
        const x0i = cx + Math.cos(a0) * inner;
        const y0i = cy + Math.sin(a0) * inner;
        const x1i = cx + Math.cos(a1) * inner;
        const y1i = cy + Math.sin(a1) * inner;
        doc.triangle(x0o, y0o, x1o, y1o, x1i, y1i, "F");
        doc.triangle(x0o, y0o, x1i, y1i, x0i, y0i, "F");
      }
      startAngle = endAngle;
    }
    doc.setFontSize(8);
    doc.setTextColor(80);
    doc.text("Total", cx, cy - 4, { align: "center" });
    doc.setFontSize(12);
    doc.setTextColor(20);
    doc.text(centerLabel ?? String(total), cx, cy + 8, { align: "center" });
  }

  const legendX = region.x + region.height + 8;
  const legendY = region.y + 2;
  const lineHeight = 11;
  doc.setFontSize(8);
  segments.slice(0, 8).forEach((seg, i) => {
    const y = legendY + i * lineHeight;
    doc.setFillColor(seg.color[0], seg.color[1], seg.color[2]);
    doc.rect(legendX, y, 6, 6, "F");
    doc.setTextColor(40);
    const label = `${seg.label} (${seg.value})`;
    doc.text(label, legendX + 9, y + 5);
  });
}

/**
 * Horizontal bar chart with a fixed-width label gutter on the left and a
 * value annotation on the right. Truncates long labels with an ellipsis so
 * the bars stay aligned.
 */
export function drawHorizontalBars(
  doc: JsPDFInstance,
  rows: BarRow[],
  region: ChartRegion,
): void {
  if (rows.length === 0) {
    doc.setFontSize(9);
    doc.setTextColor(120);
    doc.text("(no data)", region.x, region.y + region.height / 2);
    return;
  }
  const max = Math.max(1, ...rows.map((r) => r.value));
  const labelWidth = 90;
  const barAreaX = region.x + labelWidth;
  const barAreaW = region.width - labelWidth - 30;
  const slot = region.height / rows.length;
  const barH = Math.max(6, Math.min(14, slot - 4));

  doc.setFontSize(8);
  rows.forEach((r, i) => {
    const y = region.y + slot * i + (slot - barH) / 2;
    const w = (r.value / max) * barAreaW;
    doc.setTextColor(40);
    const lbl = r.label.length > 22 ? `${r.label.slice(0, 21)}…` : r.label;
    doc.text(lbl, region.x + 2, y + barH - 2);
    const c = r.color ?? [33, 150, 243];
    doc.setFillColor(c[0], c[1], c[2]);
    doc.rect(barAreaX, y, w, barH, "F");
    doc.setTextColor(40);
    doc.text(String(r.value), barAreaX + w + 4, y + barH - 2);
  });
}

/**
 * Vertical bar chart for a fixed series (e.g. 24 hourly buckets). X-axis
 * labels are sampled (every 4th index) to avoid overlap.
 */
export function drawVerticalBars(
  doc: JsPDFInstance,
  series: number[],
  region: ChartRegion,
  labelEvery = 4,
): void {
  const buckets = series.length ? series : new Array(24).fill(0);
  const maxCount = Math.max(1, ...buckets);
  const paddingLeft = 24;
  const paddingBottom = 14;
  const chartX = region.x + paddingLeft;
  const chartY = region.y;
  const chartW = region.width - paddingLeft;
  const chartH = region.height - paddingBottom;

  doc.setDrawColor(180);
  doc.setLineWidth(0.3);
  doc.line(chartX, chartY, chartX, chartY + chartH);
  doc.line(chartX, chartY + chartH, chartX + chartW, chartY + chartH);

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

  const barWidth = Math.max(0.5, chartW / buckets.length - 0.8);
  doc.setFillColor(33, 150, 243);
  buckets.forEach((b, i) => {
    const h = maxCount > 0 ? (b / maxCount) * chartH : 0;
    const x = chartX + (i * chartW) / buckets.length + 0.4;
    const y = chartY + chartH - h;
    if (h > 0) doc.rect(x, y, barWidth, h, "F");
  });

  doc.setFontSize(6);
  for (let i = 0; i < buckets.length; i += labelEvery) {
    const x = chartX + (i * chartW) / buckets.length;
    doc.text(`${String(i).padStart(2, "0")}`, x, chartY + chartH + 6);
  }
}
