import React, { useState } from "react";
import {
  buildCountryExportRows,
  downloadText,
  sanitizeFilenamePart,
  toCsv,
} from "../../lib/download.js";
import { buildShareUrl } from "../../lib/urlState.js";

export default function DownloadActions({
  activeCountry,
  links,
  proxyState,
  filters,
  shortlist,
}) {
  const [message, setMessage] = useState("");

  async function copyShareUrl() {
    const shareUrl = buildShareUrl({
      country: activeCountry.iso2,
      technology: filters.technology,
      region: filters.region,
      query: filters.query,
      compare: shortlist,
    });
    if (!navigator.clipboard?.writeText) {
      setMessage(`클립보드 권한이 없어 링크를 표시합니다: ${shareUrl}`);
      return;
    }
    try {
      await navigator.clipboard.writeText(shareUrl);
      setMessage("현재 화면 링크를 클립보드에 복사했습니다.");
    } catch {
      setMessage(`클립보드 권한이 없어 링크를 표시합니다: ${shareUrl}`);
    }
  }

  function downloadCsv() {
    const rows = buildCountryExportRows(activeCountry, links, proxyState.dashboard);
    downloadText(
      `${sanitizeFilenamePart(activeCountry.iso2)}-evidence-links.csv`,
      toCsv(rows),
      "text/csv;charset=utf-8"
    );
    setMessage("근거 링크 CSV를 생성했습니다.");
  }

  function downloadJson() {
    const payload = {
      exportedAt: new Date().toISOString(),
      country: activeCountry,
      filters,
      shortlist,
      proxyStatus: {
        dashboardFetchedAt: proxyState.dashboard?.fetchedAt || null,
        projectsFetchedAt: proxyState.projects?.fetchedAt || null,
        fallback: !!proxyState.error,
      },
      links,
    };
    downloadText(
      `${sanitizeFilenamePart(activeCountry.iso2)}-strategy-map.json`,
      JSON.stringify(payload, null, 2),
      "application/json;charset=utf-8"
    );
    setMessage("검토용 JSON을 생성했습니다.");
  }

  return (
    <section className="download-actions" aria-label="공유와 다운로드">
      <button type="button" className="primary-action" onClick={copyShareUrl}>
        화면 링크 복사
      </button>
      <button type="button" className="secondary-action" onClick={downloadCsv}>
        근거 CSV 다운로드
      </button>
      <button type="button" className="secondary-action" onClick={downloadJson}>
        검토 JSON 다운로드
      </button>
      <span aria-live="polite">{message}</span>
    </section>
  );
}
