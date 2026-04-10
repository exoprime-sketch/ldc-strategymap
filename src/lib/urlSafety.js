const HTTP_PROTOCOLS = new Set(["http:", "https:"]);

const LINK_GROUP_LABELS = {
  country: "국가 포털",
  documents: "공식 문서",
  projects: "프로젝트",
  partners: "파트너",
  data: "공개 데이터",
  provinces: "지역 포털",
  global: "글로벌 참고자료",
};

const OFFICIAL_GROUPS = new Set(["country", "documents", "projects", "data"]);

export function toSafeUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") return null;
  try {
    const url = new URL(rawUrl.trim());
    if (!HTTP_PROTOCOLS.has(url.protocol)) return null;
    url.hash = url.hash.slice(0, 120);
    return url;
  } catch {
    return null;
  }
}

export function collectAllowedHosts(whitelist = {}) {
  const hosts = new Set();
  for (const row of flattenWhitelistLinks(whitelist)) {
    const url = toSafeUrl(row.href);
    if (url) hosts.add(url.hostname.toLowerCase());
  }
  return hosts;
}

export function flattenWhitelistLinks(whitelist = {}) {
  const rows = [];
  for (const [countryCode, countryBundle] of Object.entries(whitelist || {})) {
    if (countryCode === "meta") continue;
    if (countryCode === "global") {
      for (const [key, href] of Object.entries(countryBundle || {})) {
        rows.push({
          countryCode: "GLOBAL",
          group: "global",
          groupLabel: LINK_GROUP_LABELS.global,
          key,
          label: humanizeLinkKey(key),
          href,
          sourceType: "curated",
        });
      }
      continue;
    }

    for (const [group, links] of Object.entries(countryBundle || {})) {
      for (const [key, href] of Object.entries(links || {})) {
        rows.push({
          countryCode,
          group,
          groupLabel: LINK_GROUP_LABELS[group] || group,
          key,
          label: humanizeLinkKey(key),
          href,
          sourceType: OFFICIAL_GROUPS.has(group) ? "official" : "curated",
        });
      }
    }
  }
  return rows.filter((row) => !!toSafeUrl(row.href));
}

export function isAllowedExternalUrl(rawUrl, allowedHosts = new Set()) {
  const url = toSafeUrl(rawUrl);
  if (!url) return false;
  const hostname = url.hostname.toLowerCase();
  return (
    allowedHosts.has(hostname) ||
    [...allowedHosts].some((allowed) => hostname.endsWith(`.${allowed}`))
  );
}

export function sanitizeExternalUrl(rawUrl, allowedHosts = new Set()) {
  return isAllowedExternalUrl(rawUrl, allowedHosts) ? toSafeUrl(rawUrl).href : "";
}

export function externalLinkSecurityProps() {
  return {
    target: "_blank",
    rel: "noopener noreferrer",
  };
}

export function humanizeLinkKey(key = "") {
  return String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (token) => token.toUpperCase())
    .trim();
}

