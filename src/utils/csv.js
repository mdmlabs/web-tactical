import { exportFile, Notify } from "quasar";
import * as XLSX from "xlsx";

function _wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');
  /**
   * Excel accepts \n and \r in strings, but some other CSV parsers do not
   * Uncomment the next two lines to escape new lines
   */
  // .split('\n').join('\\n')
  // .split('\r').join('\\r')

  return `"${formatted}"`;
}

export function exportTableToCSV(rows, columns, filename = "export.csv") {
  // naive encoding to csv format
  const content = [columns.map((col) => _wrapCsvValue(col.label))]
    .concat(
      rows.map((row) =>
        columns
          .map((col) =>
            _wrapCsvValue(
              typeof col.field === "function"
                ? col.field(row)
                : row[col.field === void 0 ? col.name : col.field],
              col.format,
            ),
          )
          .join(","),
      ),
    )
    .join("\r\n");

  const status = exportFile(filename, content, "text/csv");

  if (status !== true) {
    Notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
}

export function exportTableToJSON(rows, columns, filename = "export.json") {
  const data = rows.map((row) => {
    const obj = {};
    columns.forEach((col) => {
      const key = col.label || col.name;
      const value =
        typeof col.field === "function"
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field];
      obj[key] = value;
    });
    return obj;
  });

  const content = JSON.stringify(data, null, 2);
  const status = exportFile(filename, content, "application/json");

  if (status !== true) {
    Notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
}

export function exportTableToXLSX(rows, columns, filename = "export.xlsx") {
  const data = rows.map((row) => {
    const obj = {};
    columns.forEach((col) => {
      const key = col.label || col.name;
      const value =
        typeof col.field === "function"
          ? col.field(row)
          : row[col.field === void 0 ? col.name : col.field];
      obj[key] = value;
    });
    return obj;
  });

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");

  const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const status = exportFile(filename, blob, blob.type);

  if (status !== true) {
    Notify({
      message: "Browser denied file download...",
      color: "negative",
      icon: "warning",
    });
  }
}

export function exportPolicyCollections(collections, format = "csv") {
  const timestamp = new Date().toISOString().replaceAll(/[:.]/g, "-").slice(0, -5);
  const filename = `policy-collections-${timestamp}.${format}`;

  const columns = [
    { name: "name", label: "Collection Name", field: "name" },
    { name: "explainText", label: "Description", field: "explainText" },
    {
      name: "policiesCount",
      label: "Policies Count",
      field: (row) => row.policies?.length || 0,
    },
    {
      name: "policies",
      label: "Policies",
      field: (row) =>
        row.policies?.map((p) => p.name).join("; ") || "",
    },
  ];

  if (format === "xlsx") {
    exportTableToXLSX(collections, columns, filename);
  } else {
    exportTableToCSV(collections, columns, filename);
  }
}
