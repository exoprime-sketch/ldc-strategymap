export async function fetchJsonWithTimeout(url, options = {}) {
  const timeoutMs = options.timeoutMs || 9000;
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    });
    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }
    return await res.json();
  } finally {
    window.clearTimeout(timer);
  }
}

export async function fetchCountryDashboard(iso2) {
  return fetchJsonWithTimeout(
    `/api/live/v1/country-dashboard?country=${encodeURIComponent(iso2)}`,
    { timeoutMs: 10000 }
  );
}

export async function fetchCountryProjects({ iso2, region, theme }) {
  const params = new URLSearchParams({
    country: iso2,
    region: region || "",
    theme: theme || "",
  });
  return fetchJsonWithTimeout(`/api/pipeline/v1/projects?${params.toString()}`, {
    timeoutMs: 10000,
  });
}
