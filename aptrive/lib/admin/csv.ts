/**
 * Minimal dependency-free CSV parser (RFC 4180-ish): handles quoted
 * fields, escaped quotes ("") inside quotes, commas/newlines inside
 * quoted fields, and both \n and \r\n line endings.
 *
 * Deliberately hand-rolled instead of adding a package for a single
 * parsing job — if XLSX/JSON import is added later (see roadmap),
 * reach for a real library (e.g. papaparse + SheetJS) at that point
 * rather than extending this by hand.
 */
export function parseCsv(input: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  const text = input.replace(/\r\n/g, "\n").replace(/\r/g, "\n");

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (inQuotes) {
      if (char === '"' && next === '"') {
        field += '"';
        i++;
      } else if (char === '"') {
        inQuotes = false;
      } else {
        field += char;
      }
      continue;
    }

    if (char === '"') {
      inQuotes = true;
    } else if (char === ",") {
      row.push(field);
      field = "";
    } else if (char === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += char;
    }
  }

  // Flush the last field/row if the file doesn't end with a newline.
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // Drop fully-empty trailing rows (common with trailing newlines).
  return rows.filter((r) => r.some((cell) => cell.trim().length > 0));
}

export type CsvRecord = Record<string, string>;

/**
 * Parses CSV text into an array of header-keyed records. The first
 * row is treated as the header; header cells are trimmed, and record
 * values are trimmed too (leading/trailing whitespace in a CSV cell
 * is essentially always accidental, never a real answer choice).
 */
export function parseCsvToRecords(input: string): CsvRecord[] {
  const rows = parseCsv(input);
  if (rows.length === 0) return [];

  const headers = rows[0].map((h) => h.trim());
  return rows.slice(1).map((row) => {
    const record: CsvRecord = {};
    headers.forEach((header, index) => {
      record[header] = (row[index] ?? "").trim();
    });
    return record;
  });
}
