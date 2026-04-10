export function sanitizeFilenamePart(value = "download") {
  const clean = String(value || "download")
    .replace(/[<>:"/\\|?*\u0000-\u001f]/g, "-")
    .replace(/\s+/g, "-")
    .slice(0, 80);
  return clean || "download";
}

export function sanitizeCsvCell(value = "") {
  const text = String(value ?? "");
  return /^[=+\-@]/.test(text) ? `'${text}` : text;
}

export function toCsv(rows = []) {
  if (!rows.length) return "";
  const headers = Object.keys(rows[0]);
  const encode = (value) => `"${sanitizeCsvCell(value).replace(/"/g, '""')}"`;
  return [
    headers.map(encode).join(","),
    ...rows.map((row) => headers.map((key) => encode(row[key])).join(",")),
  ].join("\r\n");
}

export function downloadText(filename, text, type = "text/plain;charset=utf-8") {
  const blob = new Blob([text], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = sanitizeFilenamePart(filename);
  anchor.rel = "noopener noreferrer";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 500);
}

export function buildCountryExportRows(country, links = [], proxyState = null) {
  return links.map((link) => ({
    country: country?.nameKo || country?.iso2 || "",
    iso2: country?.iso2 || "",
    focusRegion: country?.focusRegion || "",
    primaryTechnology: country?.primaryTech || "",
    sourceType: link.sourceType,
    sourceGroup: link.groupLabel,
    sourceLabel: link.label,
    href: link.href,
    lastChecked:
      proxyState?.fetchedAt || country?.metadataUpdatedAt || "공개 seed 기준",
  }));
}
