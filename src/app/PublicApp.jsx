import React, { useCallback, useMemo, useState } from "react";
import SiteHeader from "../components/SiteHeader.jsx";
import StatusNotice from "../components/StatusNotice.jsx";
import { COUNTRY_CATALOG } from "../data/countryCatalog.js";
import {
  METHODOLOGY_NOTES,
  PLATFORM_META,
  RELEASE_SCOPE_ITEMS,
} from "../data/platformCopy.js";
import { OFFICIAL_LINK_WHITELIST } from "../data/officialLinks.js";
import { safeLinkRowsForCountry, filterCountries } from "../lib/countryData.js";
import { parseUrlState } from "../lib/urlState.js";
import { useCtisDataset } from "../hooks/useCtisDataset.js";
import { useProxyCountryDashboard } from "../hooks/useProxyCountryDashboard.js";
import StrategyMap from "../features/map/StrategyMap.jsx";
import ExplorerPanel from "../features/explorer/ExplorerPanel.jsx";
import EvidencePanel from "../features/evidence/EvidencePanel.jsx";
import ComparePanel from "../features/compare/ComparePanel.jsx";
import DownloadActions from "../features/download/DownloadActions.jsx";

const SHORTLIST_LIMIT = 5;

export default function PublicApp() {
  const initialState = useMemo(
    () =>
      parseUrlState(
        typeof window !== "undefined" ? window.location.search : ""
      ),
    []
  );
  const [filters, setFilters] = useState({
    query: initialState.query,
    technology: initialState.technology,
    region: initialState.region,
  });
  const [activeIso2, setActiveIso2] = useState(
    COUNTRY_CATALOG.some((country) => country.iso2 === initialState.country)
      ? initialState.country
      : "VN"
  );
  const [shortlist, setShortlist] = useState(
    initialState.compare.filter((iso2) =>
      COUNTRY_CATALOG.some((country) => country.iso2 === iso2)
    )
  );

  const regions = useMemo(
    () => ["전체 지역", ...new Set(COUNTRY_CATALOG.map((item) => item.region))],
    []
  );
  const filteredCountries = useMemo(
    () => filterCountries(COUNTRY_CATALOG, filters),
    [filters]
  );
  const activeCountry = useMemo(
    () =>
      COUNTRY_CATALOG.find((country) => country.iso2 === activeIso2) ||
      filteredCountries[0] ||
      COUNTRY_CATALOG[0],
    [activeIso2, filteredCountries]
  );
  const activeLinks = useMemo(
    () => safeLinkRowsForCountry(OFFICIAL_LINK_WHITELIST, activeCountry.iso2),
    [activeCountry.iso2]
  );

  const ctisDatasetState = useCtisDataset();
  const proxyState = useProxyCountryDashboard(
    activeCountry,
    filters.technology === "전체 기술" ? activeCountry.primaryTech : filters.technology
  );

  const handleSelectCountry = useCallback((iso2) => {
    setActiveIso2(iso2);
  }, []);

  const toggleShortlist = useCallback((iso2) => {
    setShortlist((prev) => {
      if (prev.includes(iso2)) return prev.filter((item) => item !== iso2);
      return [iso2, ...prev].slice(0, SHORTLIST_LIMIT);
    });
  }, []);

  return (
    <main className="app-shell">
      <SiteHeader />

      <section className="intro-band" aria-labelledby="platform-title">
        <div>
          <p>공개형 지도 기반 정보 플랫폼</p>
          <h1 id="platform-title">{PLATFORM_META.serviceName}</h1>
          <p>
            국가별 공식 링크, CTIS 공개 seed, same-origin proxy 조회 상태를 한
            화면에서 구분해 개도국 기후기술 협력 후보를 탐색합니다.
          </p>
        </div>
        <div className="intro-facts" aria-label="플랫폼 공개 범위">
          <strong>10개 국가</strong>
          <span>allowlist 기반 공식 링크</span>
          <strong>admin 비노출</strong>
          <span>public build 기본값</span>
        </div>
      </section>

      <section className="workspace-layout">
        <ExplorerPanel
          filters={filters}
          regions={regions}
          countries={filteredCountries}
          activeCountry={activeCountry}
          shortlist={shortlist}
          onChangeFilters={setFilters}
          onSelectCountry={handleSelectCountry}
          onToggleShortlist={toggleShortlist}
        />

        <div className="map-column">
          <StrategyMap
            countries={filteredCountries.length ? filteredCountries : COUNTRY_CATALOG}
            activeCountry={activeCountry}
            shortlist={shortlist}
            onSelectCountry={handleSelectCountry}
          />
          <DownloadActions
            activeCountry={activeCountry}
            links={activeLinks}
            proxyState={proxyState}
            filters={filters}
            shortlist={shortlist}
          />
        </div>
      </section>

      <EvidencePanel
        country={activeCountry}
        links={activeLinks}
        ctisDatasetState={ctisDatasetState}
        proxyState={proxyState}
      />

      <ComparePanel
        countries={COUNTRY_CATALOG}
        shortlist={shortlist}
        onToggleShortlist={toggleShortlist}
        onClearShortlist={() => setShortlist([])}
      />

      <section className="methodology-panel" id="methodology">
        <div className="section-heading">
          <p>방법론</p>
          <h2>공개 전제를 먼저 말합니다.</h2>
        </div>
        <div className="note-grid">
          {METHODOLOGY_NOTES.map((note) => (
            <StatusNotice key={note} tone="info">
              {note}
            </StatusNotice>
          ))}
        </div>
      </section>

      <section className="release-panel" id="release">
        <div className="section-heading">
          <p>릴리스 기준</p>
          <h2>public build에서 보장하는 분리 원칙</h2>
        </div>
        <ul>
          {RELEASE_SCOPE_ITEMS.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>
    </main>
  );
}
