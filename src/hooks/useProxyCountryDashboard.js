import { useEffect, useState } from "react";
import { fetchCountryDashboard, fetchCountryProjects } from "../lib/proxyClient.js";

export function useProxyCountryDashboard(country, technology) {
  const [state, setState] = useState({
    loading: false,
    error: "",
    dashboard: null,
    projects: null,
  });

  useEffect(() => {
    if (!country?.iso2) return;
    let cancelled = false;
    setState((prev) => ({
      ...prev,
      loading: true,
      error: "",
    }));

    Promise.allSettled([
      fetchCountryDashboard(country.iso2),
      fetchCountryProjects({
        iso2: country.iso2,
        region: country.focusRegion,
        theme: technology || country.primaryTech,
      }),
    ]).then(([dashboardResult, projectResult]) => {
      if (cancelled) return;
      const dashboard =
        dashboardResult.status === "fulfilled" ? dashboardResult.value : null;
      const projects = projectResult.status === "fulfilled" ? projectResult.value : null;
      setState({
        loading: false,
        error:
          dashboard || projects
            ? ""
            : "same-origin proxy에 연결하지 못해 공식 링크와 공개 seed 기준으로 표시합니다.",
        dashboard,
        projects,
      });
    });

    return () => {
      cancelled = true;
    };
  }, [country?.iso2, country?.focusRegion, country?.primaryTech, technology]);

  return state;
}
