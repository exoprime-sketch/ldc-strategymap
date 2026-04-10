import React, { useEffect, useRef, useState } from "react";

const MAPLIBRE_JS =
  "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js";
const MAPLIBRE_CSS =
  "https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css";

const MAP_STYLE = {
  version: 8,
  glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
  sources: {
    osm: {
      type: "raster",
      tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
      tileSize: 256,
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    },
  },
  layers: [
    {
      id: "osm",
      type: "raster",
      source: "osm",
    },
  ],
};

export default function StrategyMap({
  countries,
  activeCountry,
  shortlist,
  onSelectCountry,
}) {
  const containerRef = useRef(null);
  const mapRef = useRef(null);
  const markerRefs = useRef([]);
  const [maplibre, setMaplibre] = useState(() =>
    typeof window !== "undefined" ? window.maplibregl || null : null
  );

  useEffect(() => {
    if (maplibre || typeof window === "undefined") return;
    let cancelled = false;
    loadMapLibreAssets().then((loaded) => {
      if (!cancelled) setMaplibre(loaded);
    });
    return () => {
      cancelled = true;
    };
  }, [maplibre]);

  useEffect(() => {
    if (!maplibre || !containerRef.current || mapRef.current) return;

    mapRef.current = new maplibre.Map({
      container: containerRef.current,
      style: MAP_STYLE,
      center: [35, 8],
      zoom: 1.5,
      maxZoom: 8,
      minZoom: 1.2,
      attributionControl: false,
    });
    mapRef.current.addControl(
      new maplibre.NavigationControl({ visualizePitch: false }),
      "bottom-right"
    );
    mapRef.current.addControl(new maplibre.AttributionControl({ compact: true }));

    return () => {
      markerRefs.current.forEach((marker) => marker.remove());
      markerRefs.current = [];
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [maplibre]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || !maplibre) return;
    markerRefs.current.forEach((marker) => marker.remove());
    markerRefs.current = [];

    const bounds = new maplibre.LngLatBounds();
    countries.forEach((country) => {
      bounds.extend(country.center);
      const markerEl = document.createElement("button");
      markerEl.type = "button";
      markerEl.className = [
        "map-marker",
        activeCountry?.iso2 === country.iso2 ? "is-active" : "",
        shortlist.includes(country.iso2) ? "is-saved" : "",
      ]
        .filter(Boolean)
        .join(" ");
      markerEl.setAttribute("aria-label", `${country.nameKo} 선택`);
      markerEl.innerHTML = `<span>${country.iso2}</span>`;
      markerEl.addEventListener("click", () => onSelectCountry(country.iso2));

      const popup = new maplibre.Popup({ offset: 18 }).setHTML(
        `<strong>${escapeHtml(country.nameKo)}</strong><br/><span>${escapeHtml(
          country.primaryTech
        )} · ${escapeHtml(country.focusRegion)}</span>`
      );

      const marker = new maplibre.Marker({ element: markerEl, anchor: "center" })
        .setLngLat(country.center)
        .setPopup(popup)
        .addTo(map);
      markerRefs.current.push(marker);
    });

    if (!bounds.isEmpty()) {
      map.fitBounds(bounds, {
        padding: { top: 64, bottom: 64, left: 64, right: 64 },
        maxZoom: countries.length <= 1 ? 5 : 3.2,
        duration: 450,
      });
    }
  }, [activeCountry?.iso2, countries, maplibre, onSelectCountry, shortlist]);

  return (
    <section className="map-surface" aria-label="협력 후보 국가 지도">
      <div className="map-container" ref={containerRef} />
      {!maplibre ? (
        <div className="map-loading" aria-live="polite">
          MapLibre 지도를 불러오는 중입니다.
        </div>
      ) : null}
      <div className="map-overlay" aria-live="polite">
        <strong>{activeCountry?.nameKo || "국가 선택"}</strong>
        <span>
          {activeCountry
            ? `${activeCountry.primaryTech} · ${activeCountry.focusRegion}`
            : "지도 마커 또는 목록을 선택하세요."}
        </span>
      </div>
    </section>
  );
}

function loadMapLibreAssets() {
  if (window.maplibregl) return Promise.resolve(window.maplibregl);

  if (!document.querySelector(`link[href="${MAPLIBRE_CSS}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = MAPLIBRE_CSS;
    document.head.appendChild(link);
  }

  return new Promise((resolve, reject) => {
    const existing = document.getElementById("maplibre-gl-js");
    if (existing) {
      existing.addEventListener("load", () => resolve(window.maplibregl), {
        once: true,
      });
      existing.addEventListener("error", reject, { once: true });
      return;
    }
    const script = document.createElement("script");
    script.id = "maplibre-gl-js";
    script.src = MAPLIBRE_JS;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.onload = () => resolve(window.maplibregl);
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function escapeHtml(value = "") {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
