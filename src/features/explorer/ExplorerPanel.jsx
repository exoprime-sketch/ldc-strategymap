import React from "react";
import { TECHNOLOGY_OPTIONS } from "../../data/countryCatalog.js";
import SourceBadge from "../../components/SourceBadge.jsx";

export default function ExplorerPanel({
  filters,
  regions,
  countries,
  activeCountry,
  shortlist,
  onChangeFilters,
  onSelectCountry,
  onToggleShortlist,
}) {
  return (
    <aside className="control-panel" id="explore" aria-label="국가와 기술 탐색">
      <div className="section-heading">
        <p>공개 탐색</p>
        <h2>국가, 기술, 지역을 함께 좁혀 봅니다.</h2>
      </div>

      <div className="filter-grid">
        <label>
          검색
          <input
            type="search"
            value={filters.query}
            placeholder="국가, 권역, 기술 검색"
            onChange={(event) =>
              onChangeFilters({ ...filters, query: event.target.value })
            }
          />
        </label>
        <label>
          기술
          <select
            value={filters.technology}
            onChange={(event) =>
              onChangeFilters({ ...filters, technology: event.target.value })
            }
          >
            {TECHNOLOGY_OPTIONS.map((tech) => (
              <option key={tech} value={tech}>
                {tech}
              </option>
            ))}
          </select>
        </label>
        <label>
          지역
          <select
            value={filters.region}
            onChange={(event) =>
              onChangeFilters({ ...filters, region: event.target.value })
            }
          >
            {regions.map((region) => (
              <option key={region} value={region}>
                {region}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="result-count" aria-live="polite">
        {countries.length}개 국가 후보 표시 중
      </div>

      <div className="country-list" role="list">
        {countries.map((country) => (
          <button
            type="button"
            key={country.iso2}
            className={`country-row ${
              activeCountry?.iso2 === country.iso2 ? "is-active" : ""
            }`}
            onClick={() => onSelectCountry(country.iso2)}
            role="listitem"
          >
            <span>
              <strong>{country.nameKo}</strong>
              <small>
                {country.nameEn} · {country.region}
              </small>
            </span>
            <span className="country-row-meta">
              <SourceBadge type="official" />
              <small>{country.linkCount}개 링크</small>
            </span>
          </button>
        ))}
      </div>

      {activeCountry ? (
        <div className="active-country-summary">
          <p>선택 국가</p>
          <h3>
            {activeCountry.nameKo} <span>{activeCountry.iso2}</span>
          </h3>
          <dl>
            <div>
              <dt>초점 권역</dt>
              <dd>{activeCountry.focusRegion}</dd>
            </div>
            <div>
              <dt>주요 기술</dt>
              <dd>{activeCountry.primaryTech}</dd>
            </div>
            <div>
              <dt>데이터 상태</dt>
              <dd>
                공식 링크 {activeCountry.dataStatus.official}개 · 선별 링크{" "}
                {activeCountry.dataStatus.curated}개
              </dd>
            </div>
          </dl>
          <p>{activeCountry.useCase}</p>
          <button
            className="secondary-action"
            type="button"
            onClick={() => onToggleShortlist(activeCountry.iso2)}
          >
            {shortlist.includes(activeCountry.iso2)
              ? "비교 목록에서 제거"
              : "비교 목록에 담기"}
          </button>
        </div>
      ) : null}
    </aside>
  );
}
