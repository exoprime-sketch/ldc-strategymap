import { sanitizeExternalUrl } from "./urlSafety.js";

const GROUP_ORDER = ["country", "documents", "projects", "data", "partners"];

export function safeLinkRowsForCountry(whitelist = {}, iso2 = "", allowedHosts) {
  const code = String(iso2 || "").toUpperCase();
  const countryBundle = whitelist?.[code] || {};
  const rows = [];

  for (const group of GROUP_ORDER) {
    const links = countryBundle[group] || {};
    for (const [key, href] of Object.entries(links)) {
      const safeHref = allowedHosts ? sanitizeExternalUrl(href, allowedHosts) : href;
      if (!safeHref) continue;
      rows.push({
        countryCode: code,
        group,
        key,
        href: safeHref,
        label: labelFromKey(key),
        groupLabel: groupLabel(group),
        sourceType: ["country", "documents", "projects", "data"].includes(group)
          ? "official"
          : "curated",
      });
    }
  }

  return rows;
}

export function groupLabel(group = "") {
  return (
    {
      country: "국가·기관 공식 포털",
      documents: "정책·공식 문서",
      projects: "프로젝트 근거",
      data: "공개 데이터",
      partners: "파트너·지역 기관",
    }[group] || group
  );
}

export function labelFromKey(key = "") {
  return String(key)
    .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase())
    .replace(/\bWb\b/g, "World Bank")
    .replace(/\bGcf\b/g, "GCF")
    .replace(/\bAdb\b/g, "ADB")
    .replace(/\bNdc\b/g, "NDC")
    .replace(/\bNap\b/g, "NAP")
    .trim();
}

export function evidenceSummary(country, links = []) {
  const groups = new Set(links.map((item) => item.group));
  return {
    officialCount: links.filter((item) => item.sourceType === "official").length,
    curatedCount: links.filter((item) => item.sourceType === "curated").length,
    groupLabels: [...groups].map(groupLabel),
    hasCtIsSeed: country?.iso2 === "VN",
  };
}

export function filterCountries(countries = [], filters = {}) {
  const query = String(filters.query || "").trim().toLowerCase();
  const tech = filters.technology || "전체 기술";
  const region = filters.region || "전체 지역";

  return countries.filter((country) => {
    const matchesQuery =
      !query ||
      [country.nameKo, country.nameEn, country.iso2, country.focusRegion, country.useCase]
        .join(" ")
        .toLowerCase()
        .includes(query);
    const matchesTech =
      tech === "전체 기술" || country.technologies.includes(tech);
    const matchesRegion = region === "전체 지역" || country.region === region;
    return matchesQuery && matchesTech && matchesRegion;
  });
}
