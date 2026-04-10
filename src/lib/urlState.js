const SAFE_TEXT_RE = /[^\p{L}\p{N}\s._:-]/gu;

export function normalizeUrlStateText(value = "", maxLength = 80) {
  return String(value || "")
    .replace(SAFE_TEXT_RE, "")
    .trim()
    .slice(0, maxLength);
}

export function parseUrlState(search = "") {
  const params = new URLSearchParams(String(search || ""));
  const country = normalizeUrlStateText(params.get("country") || "VN", 8).toUpperCase();
  const technology = normalizeUrlStateText(params.get("tech") || "전체 기술", 50);
  const region = normalizeUrlStateText(params.get("region") || "전체 지역", 30);
  const query = normalizeUrlStateText(params.get("q") || "", 60);
  const compare = String(params.get("compare") || "")
    .split(",")
    .map((item) => normalizeUrlStateText(item, 8).toUpperCase())
    .filter(Boolean)
    .slice(0, 5);

  return {
    country: country || "VN",
    technology: technology || "전체 기술",
    region: region || "전체 지역",
    query,
    compare,
  };
}

export function buildShareUrl(state = {}, origin = "") {
  const base =
    origin ||
    (typeof window !== "undefined"
      ? `${window.location.origin}${window.location.pathname}`
      : "/");
  const url = new URL(base, "https://example.invalid");
  url.searchParams.set("country", normalizeUrlStateText(state.country || "VN", 8));
  if (state.technology && state.technology !== "전체 기술") {
    url.searchParams.set("tech", normalizeUrlStateText(state.technology, 50));
  }
  if (state.region && state.region !== "전체 지역") {
    url.searchParams.set("region", normalizeUrlStateText(state.region, 30));
  }
  if (state.query) {
    url.searchParams.set("q", normalizeUrlStateText(state.query, 60));
  }
  if (Array.isArray(state.compare) && state.compare.length) {
    url.searchParams.set(
      "compare",
      state.compare
        .map((item) => normalizeUrlStateText(item, 8).toUpperCase())
        .filter(Boolean)
        .slice(0, 5)
        .join(",")
    );
  }

  if (base.startsWith("/")) return `${url.pathname}${url.search}`;
  return url.href.replace("https://example.invalid", "");
}
