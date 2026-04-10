import { useEffect, useState } from "react";

const CTIS_PUBLIC_DATASET = "/ctis_visible_site_dataset.json";

export function useCtisDataset() {
  const [state, setState] = useState({
    loading: true,
    error: "",
    data: null,
  });

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(CTIS_PUBLIC_DATASET, {
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (!cancelled) {
          setState({ loading: false, error: "", data });
        }
      } catch {
        if (!cancelled) {
          setState({
            loading: false,
            error: "CTIS 공개 seed를 불러오지 못했습니다.",
            data: null,
          });
        }
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}

